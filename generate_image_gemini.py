"""
Image Generation using Google Gemini 3 Pro API
Generate photorealistic images from text prompts
"""

import os
import time
import base64
import requests
from typing import Dict, Optional, List


# API Configuration
from dotenv import load_dotenv

load_dotenv()

API_ENDPOINT = 'aiplatform.googleapis.com'
MODEL_ID = 'gemini-3-pro-image-preview'
B2_UPLOAD_URL = 'https://de.switchx.dev/upload/stream-b2'
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

def generate_image(
    prompt: str,
    reference_image_path: Optional[str] = None,
    reference_image_base64: Optional[str] = None,
    aspect_ratio: str = "9:16",
    image_size: str = "1K",
    mime_type: str = "image/png",
    temperature: float = 1.0,
    person_generation: str = "ALLOW_ALL"
) -> Dict:
    """
    Generate image using Gemini API with optional reference image

    Args:
        prompt: Text prompt describing the image to generate
        reference_image_path: Optional path to reference image file
        reference_image_base64: Optional base64 encoded reference image
        aspect_ratio: Image aspect ratio (9:16, 16:9, 1:1, etc)
        image_size: Image size (1K, 2K, 4K)
        mime_type: Output mime type (image/png, image/jpeg)
        temperature: Generation temperature (0.0-2.0)
        person_generation: Person generation policy (ALLOW_ALL, ALLOW_ADULT, etc)

    Returns:
        Dict with imageBase64, mimeType, and optional text
    """

    # Build parts array with text and optional image
    parts = []

    # Add reference image if provided
    if reference_image_path:
        with open(reference_image_path, 'rb') as f:
            image_data = base64.b64encode(f.read()).decode('utf-8')
        parts.append({
            "inlineData": {
                "mimeType": "image/png",
                "data": image_data
            }
        })
    elif reference_image_base64:
        parts.append({
            "inlineData": {
                "mimeType": "image/png",
                "data": reference_image_base64
            }
        })

    # Add text prompt
    parts.append({"text": prompt})

    request_body = {
        "contents": [
            {
                "role": "user",
                "parts": parts
            }
        ],
        "generationConfig": {
            "temperature": temperature,
            "maxOutputTokens": 32768,
            "responseModalities": ["TEXT", "IMAGE"],
            "topP": 0.95,
            "imageConfig": {
                "aspectRatio": aspect_ratio,
                "imageSize": image_size,
                "imageOutputOptions": {
                    "mimeType": mime_type
                },
                "personGeneration": person_generation
            }
        },
        "safetySettings": [
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "OFF"
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "OFF"
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "OFF"
            },
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "OFF"
            }
        ]
    }

    url = f"https://{API_ENDPOINT}/v1/publishers/google/models/{MODEL_ID}:streamGenerateContent?key={API_KEY}"

    print(f"Generating image...")
    print(f"Prompt length: {len(prompt)} characters")

    response = requests.post(url, json=request_body, timeout=180)  # 3 minutes for image generation

    if not response.ok:
        raise Exception(f"API error: {response.status_code} - {response.text}")

    data = response.json()
    result = {}

    # Handle both array and single object responses
    chunks = data if isinstance(data, list) else [data]

    for chunk in chunks:
        candidates = chunk.get('candidates', [])
        if candidates and len(candidates) > 0:
            candidate = candidates[0]
            content = candidate.get('content', {})
            parts = content.get('parts', [])

            for part in parts:
                # Check for image data
                if 'inlineData' in part and part['inlineData'].get('data'):
                    result['imageBase64'] = part['inlineData']['data']
                    result['mimeType'] = part['inlineData'].get('mimeType', mime_type)
                # Check for text (but not thoughts)
                elif 'text' in part and not part.get('thought'):
                    result['text'] = part['text']

    if not result.get('imageBase64'):
        raise Exception("No image data returned from API")

    print(f"SUCCESS: Image generated successfully")

    return result


def save_image(image_base64: str, output_path: str, mime_type: str = "image/png") -> str:
    """
    Save base64 encoded image to file

    Args:
        image_base64: Base64 encoded image data
        output_path: Path to save the image
        mime_type: Image mime type

    Returns:
        Path where image was saved
    """

    image_bytes = base64.b64decode(image_base64)

    with open(output_path, 'wb') as f:
        f.write(image_bytes)

    file_size_kb = len(image_bytes) / 1024
    print(f"Image saved to: {output_path}")
    print(f"File size: {file_size_kb:.2f} KB")

    return output_path


def upload_to_b2(image_base64: str, filename: str, mime_type: str = "image/png") -> Dict:
    """
    Upload image to Backblaze B2 storage

    Args:
        image_base64: Base64 encoded image
        filename: Filename for the upload
        mime_type: Image mime type

    Returns:
        Dict with url and fileId
    """

    print(f"Uploading to Backblaze: {filename}")

    image_bytes = base64.b64decode(image_base64)

    # Create multipart form data
    files = {
        'files': (filename, image_bytes, mime_type)
    }

    response = requests.post(B2_UPLOAD_URL, files=files, timeout=180)

    if not response.ok:
        raise Exception(f"B2 upload error: {response.status_code} - {response.text}")

    data = response.json()

    if not data.get('files') or len(data['files']) == 0:
        raise Exception("No file returned from B2 upload")

    file_info = data['files'][0]
    url = file_info['url']
    file_id = file_info['file_id']

    print(f"SUCCESS: Uploaded: {url}")

    return {
        'url': url,
        'fileId': file_id
    }


def generate_and_save_image(
    prompt: str,
    reference_image_path: Optional[str] = None,
    reference_image_base64: Optional[str] = None,
    output_path: Optional[str] = None,
    aspect_ratio: str = "9:16",
    image_size: str = "1K",
    upload_to_cloud: bool = False
) -> Dict:
    """
    Complete image generation workflow

    Args:
        prompt: Text prompt for image generation
        reference_image_path: Optional path to reference image
        reference_image_base64: Optional base64 reference image
        output_path: Optional local path to save image
        aspect_ratio: Image aspect ratio
        image_size: Image size
        upload_to_cloud: Whether to upload to B2

    Returns:
        Dict with image info (path, url, etc)
    """

    print("\nStarting Image Generation with Gemini 3 Pro\n")

    # Step 1: Generate image
    result = generate_image(
        prompt,
        reference_image_path=reference_image_path,
        reference_image_base64=reference_image_base64,
        aspect_ratio=aspect_ratio,
        image_size=image_size
    )

    response = {
        'imageBase64': result['imageBase64'],
        'mimeType': result.get('mimeType', 'image/png')
    }

    if result.get('text'):
        response['text'] = result['text']
        print(f"📄 Generated text: {result['text']}")

    # Step 2: Save locally if path provided
    if output_path:
        save_image(result['imageBase64'], output_path, result.get('mimeType', 'image/png'))
        response['localPath'] = output_path

    # Step 3: Upload to B2 if requested
    if upload_to_cloud:
        if not output_path:
            output_path = f"image_{int(time.time())}.png"

        upload_result = upload_to_b2(
            result['imageBase64'],
            os.path.basename(output_path),
            result.get('mimeType', 'image/png')
        )

        response['url'] = upload_result['url']
        response['fileId'] = upload_result['fileId']

    print("\nImage generation complete!")

    return response


def build_actor_prompt(actor_config: Dict) -> str:
    """
    Build detailed prompt from actor configuration

    Args:
        actor_config: Dict with actor styling details

    Returns:
        Formatted prompt string
    """

    style_desc = ', '.join(actor_config.get('Style', []))
    subject_desc = '. '.join(actor_config.get('Subject', []))
    made_of_desc = ', '.join(actor_config.get('MadeOutOf', []))

    camera = actor_config.get('Camera', {})
    camera_setup = f"{camera.get('type', '')}, {camera.get('lens', '')}, {camera.get('aperture', '')}, {camera.get('angle', '')}, {camera.get('focus', '')}"

    prompt = f"""Create a photorealistic portrait for a content creator avatar:

STYLE: {style_desc}

SUBJECT: {subject_desc}

WEARING/MADE OF: {made_of_desc}

ARRANGEMENT: {actor_config.get('Arrangement', '')}

BACKGROUND: {actor_config.get('Background', '')}

LIGHTING: {actor_config.get('Lighting', '')}

CAMERA SETUP: {camera_setup}

OUTPUT STYLE: {actor_config.get('OutputStyle', '')}

MOOD: {actor_config.get('Mood', '')}

Create a high-quality, professional portrait that captures this exact aesthetic and vibe. The image should look like a real photograph taken with the specified camera settings."""

    return prompt


# Example usage
if __name__ == "__main__":
    # Example 1: Simple text-to-image
    SIMPLE_PROMPT = "A professional portrait of a young woman sitting in a car, looking at the camera with a natural smile. Natural daylight, 9:16 vertical format, photorealistic style."

    try:
        result = generate_and_save_image(
            prompt=SIMPLE_PROMPT,
            output_path="test_portrait.png",
            aspect_ratio="9:16",
            image_size="1K",
            upload_to_cloud=False
        )

        print(f"\nSUCCESS!")
        if result.get('localPath'):
            print(f"Local path: {result['localPath']}")
        if result.get('url'):
            print(f"Cloud URL: {result['url']}")

    except Exception as e:
        print(f"\nERROR: {e}")

    # Example 2: Using actor configuration
    print("\n" + "="*60 + "\n")

    ACTOR_CONFIG = {
        "Style": ["Photorealistic", "Professional portrait photography"],
        "Subject": ["Young woman in her mid-20s", "Sitting in a modern car interior", "Looking directly at camera"],
        "MadeOutOf": ["Casual clothing", "Natural makeup"],
        "Arrangement": "Centered composition, subject fills most of frame",
        "Background": "Modern car interior with visible windshield",
        "Lighting": "Natural daylight through windshield, soft and even",
        "Camera": {
            "type": "DSLR",
            "lens": "50mm portrait lens",
            "aperture": "f/2.8",
            "iso": "400",
            "shutter_speed": "1/125",
            "flash": "None",
            "angle": "Eye-level, straight on",
            "focus": "Sharp focus on face"
        },
        "OutputStyle": "High-resolution photograph",
        "Mood": "Relatable, authentic, approachable"
    }

    try:
        actor_prompt = build_actor_prompt(ACTOR_CONFIG)
        print(f"Generated actor prompt:\n{actor_prompt}\n")

        result = generate_and_save_image(
            prompt=actor_prompt,
            output_path="actor_portrait.png",
            aspect_ratio="9:16",
            image_size="1K",
            upload_to_cloud=False
        )

        print(f"\nSUCCESS!")
        print(f"Image saved to: {result.get('localPath')}")

    except Exception as e:
        print(f"\nERROR: {e}")
