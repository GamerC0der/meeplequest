import os
import glob
from flask import Flask, redirect, send_from_directory

app = Flask(__name__,
            static_url_path='',
            static_folder='.')

app.config.update(
    DEBUG=os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
)

def render_page(template_name):
    try:
        with open(template_name, 'r', encoding='utf-8') as f:
            content = f.read()
        return content
    except Exception as e:
        app.logger.error(f"Error reading file {template_name}: {e}")
        return f"Error loading page: {template_name}", 500

def create_dynamic_route(template_name):
    def route():
        return render_page(template_name)
    route.__name__ = f'{template_name.replace(".html", "").replace("-", "_")}_route'
    return route

@app.route('/<path:filename>')
def serve_static(filename):
    # Serve static files (images, CSS, JS, etc.) that are not HTML
    if '.' in filename and not filename.endswith('.html'):
        try:
            return send_from_directory('.', filename)
        except FileNotFoundError:
            return f"File not found: {filename}", 404
    # If it's an HTML file or no extension, let the dynamic routes handle it
    return render_page(filename) if os.path.exists(filename) else f"File not found: {filename}", 404

html_files = [os.path.basename(f) for f in glob.glob('*.html') if f != 'index.html']

for html_file in html_files:
    route_path = f'/{html_file}'
    func_name = html_file.replace('.html', '').replace('-', '_')
    app.add_url_rule(route_path, func_name, create_dynamic_route(html_file))

@app.route('/')
def index():
    return render_page('index.html')

@app.route('/index.html')
def index_redirect():
    return redirect('/')

if __name__ == '__main__':
    app.run(debug=app.config['DEBUG'])
