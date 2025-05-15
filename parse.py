import os
import re
from pathlib import Path

if __name__ == '__main__':
    src = './src'
    dist = './docs'

    for path in Path(src).rglob('*.html'):
        with open(path, 'r', encoding='utf-8') as f:
            text = f.read()
        
        name = os.path.basename(path)
        text = re.compile(r'\.ts\'').sub('.js\'', text)

        with open(f'{dist}/{name}', 'w', encoding='utf-8') as f:
            f.write(text)