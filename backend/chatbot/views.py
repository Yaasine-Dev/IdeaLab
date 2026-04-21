import json
import os

from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

try:
    import openai
except ImportError:  # pragma: no cover
    openai = None

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

if openai is not None and OPENAI_API_KEY:
    openai.api_key = OPENAI_API_KEY

@csrf_exempt
def chat(request):
    if request.method != 'POST':
        return JsonResponse({'detail': 'Method not allowed. Use POST.'}, status=405)

    if openai is None:
        return JsonResponse(
            {
                'error': 'The openai package is not installed. Add openai to requirements and install it.'
            },
            status=500,
        )

    if not OPENAI_API_KEY:
        return JsonResponse(
            {
                'error': 'OpenAI API key is not configured. Set OPENAI_API_KEY in your environment.'
            },
            status=500,
        )

    try:
        payload = json.loads(request.body.decode('utf-8'))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({'error': 'Invalid JSON payload.'}, status=400)

    message = payload.get('message') or payload.get('prompt')
    if not message or not isinstance(message, str):
        return JsonResponse({'error': 'A non-empty string "message" field is required.'}, status=400)

    system_prompt = payload.get(
        'system',
        'You are a helpful assistant answering questions about ideas, feedback, and product development.',
    )

    try:
        response = openai.ChatCompletion.create(
            model='gpt-3.5-turbo',
            messages=[
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': message},
            ],
            temperature=0.7,
            max_tokens=400,
        )
    except Exception as exc:
        return JsonResponse({'error': str(exc)}, status=502)

    content = response.choices[0].message.get('content', '').strip()
    return JsonResponse({'reply': content})
