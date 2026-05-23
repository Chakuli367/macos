
import admin from 'firebase-admin';

const serviceAccount = {
  type: "service_account",
  project_id: "goalgrid-c5e9c",
  private_key_id: "a981b2c2a59416024831203bf657bb6f0a50a146",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCvk0vqo+BWp0nZ\nRITgyUsPGdYEVPjrDbEBZ25cv3YI3IseuEXbv+96rRtN7zp7pzVd8/KwRSI9luA9\nEv5FGo2tDkxoy8Dp71NTh3Gzi1XjDEcGrQ2NboJcluyRc18qy+jbArs3ESmB49cH\nOnmEi1h/AiIS9Ii2v8h+aOusQMnnEXfXKkZMVTP2gaMb6q1yQoJfQPYtO8xeFNBW\n7W9PiIdM9P2QUW1NolHN63mAVgtNZa/gcBE+svC/WheFnhoQDNqCcMaPHSXPz+xN\nglP1bRhJGrRjbFZw2HS3sH2tInHq40X3hCwcajONIjl7ZJslWiOtCXcc5aduJc1R\nx+eEo0LVAgMBAAECggEAFg4aPLzeOvRjvfOx/2y5zYlQzZWA+UHsiMEd52+zm5Rc\ns3yxZdPb+NyS7/zLq2nLNeSliUf975+qxnFC2JpnzqPbrFRgBOLn5DfA7C1mGhHa\nQDfv2mLV5FyfFfxYqY8Yzp4ut1GkFalxwvow9pnsgXPapOfr3o0D2gFDDY3L7wcY\nSggnLrOg9OKAnMbGiMr942a12bV2nY9VtiXYdyNrYWCErbEyM0MYMzZibNM5pvlo\niRtiU/XilLMr1Va7dkvOe6pefqS2CPsczOeOHhIBSGesFrBvQa8h/3N/DGkYHi9L\nZ9zUi5/FXQ+eYmBvlXgSi/WAV8NpK+u4b5BYDzVw9wKBgQD4MUddPh/zJBKmnV8C\nOCnW3u2qm9GUgudKhSs2MHfAtS6s0cQXlJ+a7oCReIXlwUAofTI52va4uLnSYafd\niinsiM76KWSemsqLo5agcVpULmCAsOmFBpmj+xF2nkrGAL2TE2pYGrixo6maRPDf\nzUzrkwPb9l8UUNak8sABfoJWiwKBgQC1GTll4WN9ChzYeeZx2ingRmPUoJh+sVbf\nUKEyBC+3SMcbTIKsFA0h/WRLTIADJhY2sT/BfLLrdtg6DemeFi4oh78eAlSsKLfE\no0FLA1S5zH2UeSM+zthg7XVD6pBx1WygZj85abdSpqFcF3Br2Ww7uS/HXHRKxjZB\nCYncjbFYHwKBgQDy20V5d9DLmgCmCFdvVIWcO4dT6iSprW2k/anK3KJRbvi9IoU+\nja+fasFjlwtuRisBc4AyHJBPMHKj6erYXNmpGjVtlBNhHxYSjYBWfpRkyvyi8HmQ\nMWUlkAcGit2f4hmeUOE+VOdk60CKM+t/EuSxnqmoEuv2dSOTQ/WdgK0JAQKBgCFe\noIDxYw+rSV1qONhJxuWYktSfMvpFWyiTBuDcfJ5dPrL9CicDGthkhJKLahsqbXVu\ne7z/aUiSAY3Q+ncyxxaYzNKOw2NlrVcCbgmQd5A06f7tw1zTaHOTzcPR+QPAu99i\nd8vweuMz6Q+7EfANhDANE4y8sIEGvQCG7WxCf6cpAoGBAKN5oFpmBt3gBDbtGLxX\n4NX/yQu3LfaIVDyqBEpoW4JZgh2o2JBOz5uOh3mchAskDyhO/Pb/SyqHkZu0RQtg\nG55aych4EhBji2lB7eaUfsSsSTu0h7nQkNeh+GVOixfY4cS8M2M9erWtFebCaru7\nOfTcUxGgNTxZl3tYYZAag6JY\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@goalgrid-c5e9c.iam.gserviceaccount.com",
  client_id: "109716953349619795826",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40goalgrid-c5e9c.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
  });
}

export const firestore = admin.firestore();
export const auth = admin.auth();
