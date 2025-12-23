#!/bin/bash

# Quick check and add missing Firebase Admin variables to Vercel production
echo "🔍 Checking Vercel environment variables..."

# First, let's see what's already there
echo "Current production environment variables:"
vercel env ls production

echo ""
echo "📝 Adding Firebase Admin variables to production..."

# Add the three Firebase Admin variables
echo "Adding FIREBASE_PROJECT_ID..."
echo "arida-c5faf" | vercel env add FIREBASE_PROJECT_ID production

echo "Adding FIREBASE_CLIENT_EMAIL..."
echo "firebase-adminsdk-fbsvc@arida-c5faf.iam.gserviceaccount.com" | vercel env add FIREBASE_CLIENT_EMAIL production

echo "Adding FIREBASE_PRIVATE_KEY..."
echo "-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQCIoiVFsoDJ1Yy7\nkRUp6IfjZwB9OqiTYBSGXXcSPiyNmCa+gSW2NfxfJas5xiv/C/wMqnqDNdQygBBN\nvHhRc/q1+tKpSNu8uP1XI0eFRiHe4zcnL+8Q88f2KsuyJAkYQef9NnCejPO3avK+\ntSG+1/2piA0YYuXVKoiOEJNSyw0iwPfT8zuedbBzIV4THCjqf4WhYP1HGPfuUmSi\nAHs3LwGF0BAqNV384KjA0QucvBsuqYcGSZevX61wJrQIlNXCqMnswi8xzVVaiFMM\nkamSxC/9mdZWkspHgwGRsuCUg4XId5y/FhwIAOaEi5/77e0fKOl5UWdMbDhl9kuP\n2Eyp08ILAgMBAAECgf9LBh630rGv/p+2XllFBm4BLYBz823AZCk5RhAxus6zJgkp\nBJ3GjlDvPT/VAj4C9WEl65CO3KMe4q57CaVN+fuaHT6ygH+sJUjBi7O1dg8r7mKK\n+j40+q/nxpf4PYHJwtCJlf5Jnj8r5gTf+U7q8vVI1oqg3b6/hy0Bc8kZCb3zWva+\nUatuo20aQo1utOPtEPxMewB85zz2slW4ozMmdX0jEI24i4zcFaIEntTlwrLQcEHq\nFMZqlclakNUE9Lh6lrHvKpjsDOTwhSkzOZ3dKc9+RE+g2BDhOg4esemwXqOXtkMT\n2/myaPDbR97m8fkRsDZEsH3bGx1si833jtloKcECgYEAvtcR18QpprV3jjYkXPRL\nXYL66PPfuQLRjlwW5tIymDBHDHpXn1iH3/i2g/2n7Q+/ohIleI4Zm72pfJCV1MG5\nmJHl2/l5s6piAJFTE0pM1HTQyGWdNq0qicaXkl4j6qcrd11eN9pwQxfkNIEUDERG\x3Endqrkw47JyeuJteBKBssCgYEAt0j640ECSZOoPgHsoJPITbLKs3PU+9d+uTCU\naTrfbX4Zo4YtIZkcktbG32nAa38Hd7tJtQkhhwXXVw8BZJCGsUwqtBVUb+AgfMCP\n9nxsxbGG0AYndkbCx4txqEH6p+peVv/YUyK4pEIEo6JviTlyj6Ha/88Bn0T/oORM\nWU7micECgYBakrhlLzSVaorTc97OPyOFviRXa2dC55ONfSdhZWGd2UvfIDF17w6N\nvfzhqAGLAW5x/SrLjKWaxOkrtXNnBoqPXq85N64LF1Jr8oz7GshcDRUKBzAWQxlt\nSlOlpAhn1e9LN4T//SxKq4wjXx+kssLk5U9VgsYQCjS7II67QzffAQKBgQCQNzVq\nASn6mNuFxt/Yzc+LC4ahQyAv9TT6JHZygmdxcQpdd+MlD6PDCoo7GqvUKYTHui9Z\n6lBePMNe9iijZ3EEKqljP3FMAi+t2ZqtWOQBfhlUr7L3RuBWQKtyuE+xNiF7FR6y\n85wTavrZgqN+dxxkVffK1qgxGQqHH3vPvdx6QQKBgBl6+7T47E2bN6sbj98rCkLp\nU0Zx8sxpqUZL7bUIONGi8d7XX51jwAifDM+pV2bd8PvVV3lYf4bXSH4wVp3hdR0B\neyAsiZSAjVYLIpeHj3cVvKb21uSF+v8bUFHvd3VKNMGDUC0eawTtQds+YtZb8XPl\nL3zFvrCE0gMlW3feHlTJ\n-----END PRIVATE KEY-----\n" | vercel env add FIREBASE_PRIVATE_KEY production

echo ""
echo "✅ Done! Now trigger a new deployment:"
echo "vercel --prod"