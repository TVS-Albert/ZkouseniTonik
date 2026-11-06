"""Check HTTPS deployment serves the exact runtime files from this checkout."""
import ast
from concurrent.futures import ThreadPoolExecutor
from hashlib import sha256
import os
from pathlib import Path
import re
from urllib.parse import urljoin
from urllib.request import urlopen

root=Path(__file__).resolve().parent.parent
base=os.environ.get('APP_TEST_URL','https://tvs-albert.github.io/ZkouseniTonik/')
if not base.startswith('https://'):raise ValueError('HTTPS is required for the deployed game')
assets=ast.literal_eval(re.search(r'const ASSETS=(\[[^;]+\]);',(root/'sw.js').read_text()).group(1))
def check(asset):
    path='index.html' if asset=='./' else asset.removeprefix('./')
    with urlopen(urljoin(base,asset),timeout=30) as response:
        assert response.status==200,(asset,response.status)
        data=response.read()
    assert sha256(data).digest()==sha256((root/path).read_bytes()).digest(),f'Deployment mismatch: {path}'
    return path
with ThreadPoolExecutor(max_workers=4) as pool:
    checked=list(pool.map(check,assets+['./sw.js']))
print(f'HTTPS deployment OK: {len(checked)} URLs match local runtime files.')
