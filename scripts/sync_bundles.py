import shutil
import os

def main():
    if os.path.exists('Sensuikan_App_UltraCompact.html'):
        shutil.copyfile(os.path.abspath('Sensuikan_App_UltraCompact.html'), os.path.abspath('app/Sensuikan_App_UltraCompact.html'))
        print("Copied Sensuikan_App_UltraCompact.html to app/")
    if os.path.exists('app/Sensuikan_Tablet_Offline.html'):
        shutil.copyfile(os.path.abspath('app/Sensuikan_Tablet_Offline.html'), os.path.abspath('Sensuikan_Tablet_Offline.html'))
        print("Copied Sensuikan_Tablet_Offline.html to root")

if __name__ == '__main__':
    main()
