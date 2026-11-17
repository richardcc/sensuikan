import shutil
import os

def main():
    if os.path.exists('Sensuikan_App_UltraCompact.html'):
        shutil.copy('Sensuikan_App_UltraCompact.html', 'app/Sensuikan_App_UltraCompact.html')
        print("Copied Sensuikan_App_UltraCompact.html to app/")
    if os.path.exists('app/Sensuikan_Tablet_Offline.html'):
        shutil.copy('app/Sensuikan_Tablet_Offline.html', 'Sensuikan_Tablet_Offline.html')
        print("Copied Sensuikan_Tablet_Offline.html to root")

if __name__ == '__main__':
    main()
