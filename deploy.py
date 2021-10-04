import os

if __name__ == '__main__':
  print('1. Building Online Version...')
  os.system('npm run build:online')
  print('DONE\n')

  print('2. Copying Build to Deployment...')
  os.system('rm -rf deployment/build')
  os.system('cp -r build deployment/')
  print('DONE\n')

  print('3. Deploying to Cloud Run...')
  os.system('gcloud config set project ejjy-311409')
  os.chdir('deployment')
  os.system('gcloud builds submit --tag gcr.io/ejjy-311409/ejjy-app-production')
  os.system('gcloud run deploy ejjy-app-production --platform managed --region asia-southeast1 --image gcr.io/ejjy-311409/ejjy-app-production:latest')
  print('DEPLOYMENT DONE\n')