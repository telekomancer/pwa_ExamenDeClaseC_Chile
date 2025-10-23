#!/usr/bin/env python3
"""
Servidor de debug para PWA Clase C Chile
Permite debuggear preguntas específicas
"""

import json
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import webbrowser

class DebugHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Endpoint de debug de preguntas
        if path.startswith('/debug/') and path != '/debug':
            try:
                question_id = int(path.split('/')[-1])
                self.serve_question_debug(question_id)
            except ValueError:
                self.send_error(400, "ID de pregunta inválido")
        # Servir archivos estáticos
        elif path == '/' or path == '/debug':
            self.serve_file('debug.html')
        elif path == '/quiz-debug.html':
            self.serve_file('quiz-debug.html')
        elif path == '/questions.json':
            self.serve_file('questions.json')
        elif path.startswith('/img/'):
            self.serve_file(path[1:])  # Remover el / inicial
        elif path.startswith('/icons/'):
            self.serve_file(path[1:])  # Remover el / inicial
        elif path.endswith('.css'):
            self.serve_file(path[1:])  # Remover el / inicial
        elif path.endswith('.js'):
            self.serve_file(path[1:])  # Remover el / inicial
        else:
            self.serve_file('debug.html')
    
    def serve_question_debug(self, question_id):
        """Servir debug de una pregunta específica"""
        try:
            # Cargar preguntas
            with open('questions.json', 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Buscar la pregunta
            question = None
            for q in data['questions']:
                if q['id'] == question_id:
                    question = q
                    break
            
            if not question:
                self.send_error(404, f"Pregunta {question_id} no encontrada")
                return
            
            # Generar HTML de debug
            html = self.generate_debug_html(question, data)
            
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.end_headers()
            self.wfile.write(html.encode('utf-8'))
            
        except FileNotFoundError:
            self.send_error(404, "Archivo questions.json no encontrado")
        except Exception as e:
            self.send_error(500, f"Error interno: {str(e)}")
    
    def generate_debug_html(self, question, data):
        """Generar HTML para debug de una pregunta específica"""
        html = f"""
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Debug Pregunta {question['id']} - PWA Clase C</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }}
        .container {{ max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
        .question-debug {{ border: 1px solid #ddd; padding: 20px; margin: 20px 0; border-radius: 8px; background: #f9f9f9; }}
        .question-text {{ font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #333; }}
        .options {{ margin: 15px 0; }}
        .option {{ padding: 10px; margin: 5px 0; border: 1px solid #ddd; border-radius: 5px; background: white; }}
        .option.correct {{ background: #d4edda; border-color: #c3e6cb; }}
        .explanation {{ background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #007bff; }}
        .image-container {{ text-align: center; margin: 20px 0; }}
        .question-image {{ max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 5px; }}
        .metadata {{ background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }}
        .nav {{ text-align: center; margin: 20px 0; }}
        .nav button {{ padding: 10px 20px; margin: 0 5px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }}
        .nav button:hover {{ background: #0056b3; }}
        .debug-controls {{
            background: #e7f3ff;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #007bff;
        }}
        .input-group {{
            display: flex;
            gap: 10px;
            align-items: center;
            margin-top: 15px;
        }}
        .input-group input {{
            padding: 10px 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
            width: 120px;
        }}
        .input-group button {{
            padding: 10px 20px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
        }}
        .input-group button:hover {{
            background: #218838;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 Debug Pregunta {question['id']} - PWA Clase C</h1>
        
        <div class="question-debug">
            <div class="question-text">Pregunta {question['id']}: {question['question']}</div>
            
            {f'''
            <div class="image-container">
                <img src="/{question['image']}" alt="Imagen de la pregunta" class="question-image">
            </div>
            ''' if question.get('image') else ''}
            
            <div class="options">
                <h4>Opciones:</h4>
                {''.join([f'''
                <div class="option {'correct' if (i in question['correct'] if isinstance(question['correct'], list) else i == question['correct']) else ''}">
                    {i + 1}. {option} {'✅' if (i in question['correct'] if isinstance(question['correct'], list) else i == question['correct']) else ''}
                </div>
                ''' for i, option in enumerate(question['options'])])}
            </div>
            
            <div class="explanation">
                <h4>💡 Explicación:</h4>
                <p>{question['explanation']}</p>
            </div>
            
            <div class="metadata">
                <strong>Categoría:</strong> {question['category']}<br>
                <strong>Dificultad:</strong> {question['difficulty']}<br>
                <strong>Respuesta correcta:</strong> {', '.join([f'Opción {c + 1}' for c in question['correct']]) if isinstance(question['correct'], list) else f'Opción {question['correct'] + 1}'}
            </div>
        </div>
        
        <div class="debug-controls">
            <h3>📝 Depuración de preguntas</h3>
            <p>Ingresa el número de la pregunta para visualizar y corregir el problema:</p>
            <div class="input-group">
                <input type="number" id="question-input" placeholder="Ej: 21" min="1" max="199">
                <button onclick="goToQuestion()">🔍 Ver Pregunta</button>
            </div>
        </div>
        
        <div class="nav">
            <button onclick="window.location.href='/debug/1'">Pregunta 1</button>
            <button onclick="window.location.href='/debug/21'">Pregunta 21</button>
            <button onclick="window.location.href='/debug'">Todas las Preguntas</button>
            <button onclick="window.location.href='/'">Volver a la PWA</button>
        </div>
    </div>
    
    <script>
        function goToQuestion() {{
            const input = document.getElementById('question-input');
            const questionId = parseInt(input.value);
            
            if (!questionId || questionId < 1 || questionId > 199) {{
                alert('Por favor, ingresa un número de pregunta válido (1-199)');
                return;
            }}
            
            window.location.href = '/debug/' + questionId;
        }}
        
        // Agregar evento Enter al input
        document.addEventListener('DOMContentLoaded', function() {{
            const input = document.getElementById('question-input');
            if (input) {{
                input.addEventListener('keypress', function(e) {{
                    if (e.key === 'Enter') {{
                        goToQuestion();
                    }}
                }});
            }}
        }});
    </script>
</body>
</html>
        """
        return html
    
    def serve_file(self, filename):
        """Servir archivo estático"""
        try:
            if not os.path.exists(filename):
                self.send_error(404, f"Archivo {filename} no encontrado")
                return
            
            # Determinar tipo de contenido
            if filename.endswith('.html'):
                content_type = 'text/html; charset=utf-8'
            elif filename.endswith('.json'):
                content_type = 'application/json; charset=utf-8'
            elif filename.endswith('.png'):
                content_type = 'image/png'
            elif filename.endswith('.svg'):
                content_type = 'image/svg+xml'
            elif filename.endswith('.css'):
                content_type = 'text/css'
            elif filename.endswith('.js'):
                content_type = 'application/javascript'
            else:
                content_type = 'text/plain'
            
            with open(filename, 'rb') as f:
                content = f.read()
            
            self.send_response(200)
            self.send_header('Content-type', content_type)
            self.send_header('Content-Length', str(len(content)))
            self.end_headers()
            self.wfile.write(content)
            
        except Exception as e:
            self.send_error(500, f"Error sirviendo archivo: {str(e)}")
    
    def log_message(self, format, *args):
        """Personalizar mensajes de log"""
        print(f"🌐 {self.address_string()} - {format % args}")

def main():
    port = 8000
    server_address = ('', port)
    
    print("🚗 Iniciando servidor de debug para PWA Clase C Chile...")
    print(f"🌐 Servidor en http://localhost:{port}")
    print("🔍 Endpoints de debug disponibles:")
    print(f"   - http://localhost:{port}/debug/21 (Pregunta 21)")
    print(f"   - http://localhost:{port}/debug/1 (Pregunta 1)")
    print(f"   - http://localhost:{port}/debug (Todas las preguntas)")
    print("💡 Para detener el servidor, presiona Ctrl+C")
    print()
    
    try:
        httpd = HTTPServer(server_address, DebugHandler)
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Servidor detenido")
        httpd.server_close()

if __name__ == '__main__':
    main()
