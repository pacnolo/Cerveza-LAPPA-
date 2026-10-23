# Script OPCIONAL para generar QR de la URL definitiva. Requiere qrcode y Pillow.
from pathlib import Path
from sys import argv
import qrcode

if len(argv) != 2 or not argv[1].startswith(('https://','http://')):
    raise SystemExit('Uso: python tools/generar_qr.py https://tu-url-publicada.com/')
output = Path(__file__).parent.parent / 'assets' / 'QR-LAPPA-NUEVO.png'
qr = qrcode.QRCode(box_size=18, border=4, error_correction=qrcode.constants.ERROR_CORRECT_H)
qr.add_data(argv[1]); qr.make(fit=True)
qr.make_image(fill_color='#17261b', back_color='#ffffff').save(output)
print('Guardado:', output)
