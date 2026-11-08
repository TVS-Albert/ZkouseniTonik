"""Serve only public assets in an isolated Pages-like subdirectory, then test."""
import ast
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.request

root=Path(__file__).resolve().parent.parent
with tempfile.TemporaryDirectory(prefix='liga-pages-') as temporary:
    public=Path(temporary)/'anglicka-liga'
    public.mkdir()
    assets=ast.literal_eval(re.search(r'const ASSETS=(\[[^;]+\]);',(root/'sw.js').read_text()).group(1))
    for asset in assets+['./sw.js']:
        if asset=='./': continue
        target=public/asset
        target.parent.mkdir(parents=True,exist_ok=True)
        shutil.copy2(root/asset,target)
    server=subprocess.Popen([sys.executable,'-m','http.server','4175','--bind','127.0.0.1','--directory',temporary],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    try:
        url='http://127.0.0.1:4175/anglicka-liga/'
        for attempt in range(50):
            try:
                urllib.request.urlopen(url,timeout=1).close()
                break
            except OSError:
                if server.poll() is not None: raise RuntimeError('Test server exited')
                time.sleep(.1)
        else: raise RuntimeError('Test server not ready')
        result=subprocess.run([sys.executable,str(root/('tests/browser_layout.py' if '--layout' in sys.argv else 'tests/browser_smoke.py'))],env={**os.environ,'APP_TEST_URL':url},cwd=root)
    finally:
        server.terminate()
        server.wait(timeout=5)
    sys.exit(result.returncode)
