import argparse, sys, os

if __name__ == '__main__':
  print('1. Installing dependencies...')
  os.system('npm install')
  print('DONE\n')

  print('2. Building...')
  os.system('npm run build')
  print('DONE\n')

  print('3. Copying Build to Deployment...')
  os.system('rm -rf deployment/build')
  os.system('cp -r build deployment/')
  print('DONE\n')

  print('4. Deploying to Cloud Run...')
  os.chdir('deployment')
  os.system(f'gcloud builds submit --tag gcr.io/code-chum/ejjy-app-production')
  print('DEPLOYMENT DONE\n')