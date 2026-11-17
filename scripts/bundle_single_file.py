import os
import re
import mimetypes
import base64
import json
from build_app_html import build_html

def inline_local_resources(html_str, base_dir='app'):
    def replace_link(match):
        href = match.group(1)
        if href.startswith('http://') or href.startswith('https://'):
            return match.group(0)
        full_path = os.path.join(base_dir, href)
        if os.path.exists(full_path):
            with open(full_path, 'r', encoding='utf-8') as f_res:
                return f'<style>\n/* Inlined: {href} */\n{f_res.read()}\n</style>'
        return match.group(0)

    html_str = re.sub(r'<link\s+rel=["\']stylesheet["\']\s+href=["\']([^"\']+)["\']\s*/?>', replace_link, html_str)

    def replace_script(match):
        src = match.group(1)
        if src.startswith('http://') or src.startswith('https://'):
            return match.group(0)
        full_path = os.path.join(base_dir, src)
        if os.path.exists(full_path):
            with open(full_path, 'r', encoding='utf-8') as f_res:
                return f'<script>\n/* Inlined: {src} */\n{f_res.read()}\n</script>'
        return match.group(0)

    html_str = re.sub(r'<script\s+src=["\']([^"\']+)["\']\s*>\s*</script>', replace_script, html_str)
    return html_str

def main():
    print("Building Single-File Standalone HTML...")
    build_html()
    target_dirs = ['chits', 'tokens', 'submarines_profiles', 'tracks', 'branding', 'commanders']
    asset_dict = {}

    orig_size = 0
    count = 0

    for td in target_dirs:
        dp = os.path.join('app', 'assets', td)
        if not os.path.exists(dp):
            continue
        for fname in os.listdir(dp):
            fp = os.path.join(dp, fname)
            if os.path.isfile(fp):
                orig_size += os.path.getsize(fp)
                key = f"assets/{td}/{fname}"
                with open(fp, 'rb') as f_raw:
                    data = f_raw.read()
                    mime, _ = mimetypes.guess_type(fp)
                    if not mime: mime = 'image/jpeg'
                    b64 = base64.b64encode(data).decode('ascii')
                    asset_dict[key] = f"data:{mime};base64,{b64}"
                    count += 1

    print(f"Loaded {count} assets into Base64 ({orig_size/(1024*1024):.2f} MB original).")

    script_embed = f'''<script>
window.EMBEDDED_ASSETS = {json.dumps(asset_dict)};

window.resolveAsset = function(url) {{
  if (!url) return "";
  if (url.startsWith("data:")) return url;

  // 1. Direct or normalized path match
  let clean = url.replace(/\\\\/g, '/').replace(/^\\.\\//, '').replace(/^\\//, '');
  if (window.EMBEDDED_ASSETS && window.EMBEDDED_ASSETS[clean]) {{
    return window.EMBEDDED_ASSETS[clean];
  }}

  // 2. Full URL (e.g. file:///.../assets/... or http://.../assets/...)
  const assetsIdx = clean.indexOf('assets/');
  if (assetsIdx !== -1) {{
    const subPath = clean.substring(assetsIdx);
    if (window.EMBEDDED_ASSETS && window.EMBEDDED_ASSETS[subPath]) {{
      return window.EMBEDDED_ASSETS[subPath];
    }}
  }}

  // 3. Fallback: match by filename
  const fname = clean.split('/').pop();
  if (fname && window.EMBEDDED_ASSETS) {{
    for (const k in window.EMBEDDED_ASSETS) {{
      if (k.endsWith('/' + fname) || k === fname) {{
        return window.EMBEDDED_ASSETS[k];
      }}
    }}
  }}

  return url;
}};

// Global interceptors for HTMLImageElement.prototype.src and Element.prototype.setAttribute
(function() {{
  try {{
    const origDesc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
    if (origDesc && origDesc.set) {{
      Object.defineProperty(HTMLImageElement.prototype, 'src', {{
        set: function(val) {{
          let resolved = val;
          if (typeof window.resolveAsset === 'function') {{
            resolved = window.resolveAsset(val);
          }}
          origDesc.set.call(this, resolved);
        }},
        get: function() {{
          return origDesc.get.call(this);
        }},
        configurable: true,
        enumerable: true
      }});
    }}
    const origSetAttr = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function(name, val) {{
      if (this && this.tagName === 'IMG' && typeof name === 'string' && name.toLowerCase() === 'src' && typeof window.resolveAsset === 'function') {{
        val = window.resolveAsset(val);
      }}
      return origSetAttr.call(this, name, val);
    }};
  }} catch (e) {{
    console.warn('Image interceptor init warning:', e);
  }}
}})();

// MutationObserver to resolve any images added dynamically via innerHTML
(function() {{
  function checkAndResolve(img) {{
    if (!img) return;
    const s = img.getAttribute('src');
    if (s && !s.startsWith('data:') && typeof window.resolveAsset === 'function') {{
      const res = window.resolveAsset(s);
      if (res && res !== s) img.src = res;
    }}
  }}

  if (typeof MutationObserver !== 'undefined') {{
    const obs = new MutationObserver(function(muts) {{
      for (let i = 0; i < muts.length; i++) {{
        const added = muts[i].addedNodes;
        for (let j = 0; j < added.length; j++) {{
          const n = added[j];
          if (n.nodeType === 1) {{
            if (n.tagName === 'IMG') checkAndResolve(n);
            if (n.querySelectorAll) {{
              const list = n.querySelectorAll('img');
              for (let k = 0; k < list.length; k++) checkAndResolve(list[k]);
            }}
          }}
        }}
      }}
    }});
    if (document.documentElement) {{
      obs.observe(document.documentElement, {{ childList: true, subtree: true }});
    }} else {{
      document.addEventListener('DOMContentLoaded', function() {{
        obs.observe(document.documentElement, {{ childList: true, subtree: true }});
      }});
    }}
  }}
}})();

document.addEventListener("DOMContentLoaded", function() {{
  document.querySelectorAll("img").forEach(function(img) {{
    const s = img.getAttribute("src");
    if (s && !s.startsWith("data:")) {{
      img.src = window.resolveAsset(s);
    }}
  }});
}});
</script>
'''

    with open('app/index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    html = inline_local_resources(html, base_dir='app')

    if '<head>' in html:
        html = html.replace('<head>', f'<head>\n{script_embed}', 1)
    else:
        html = script_embed + '\n' + html

    out_file = 'app/Sensuikan_Tablet_Offline.html'
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(html)

    size_mb = os.path.getsize(out_file) / (1024 * 1024)
    print(f"SUCCESS: Generated standalone bundle at '{out_file}' ({size_mb:.2f} MB)")

if __name__ == '__main__':
    main()
