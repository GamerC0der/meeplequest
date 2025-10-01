from flask import Flask, render_template

app = Flask(__name__)
app.template_folder = '.'

@app.route('/')
def hello():
    return render_template('index.html')   

@app.route('/play.html')
def play():
    return render_template('play.html')

@app.route('/play-2.html')
def play_2():
    return render_template('play-2.html')

@app.route('/modal.html')
def modal():
    return render_template('modal.html')

@app.route("/fishing-frenzy.html")
def fishing_frenzy():
    return render_template('fishing-frenzy.html')

@app.route('/fishing-frenzy-menu.html')
def fishing_frenzy_menu():
    return render_template('fishing-frenzy-menu.html')

@app.route('/arcade-1.html')
def arcade_1():
    return render_template('arcade-1.html')

@app.route('/arcade-2.html')
def arcade_2():
    return render_template('arcade-2.html')


if __name__ == '__main__':
    app.run(debug=True)
