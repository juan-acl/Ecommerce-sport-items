import { BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import { dynamoClient, TABLE_NAME } from '../src/shared/infrastructure/dynamodb/dynamodb.client';
import { s3Client, BUCKET_NAME } from '../src/shared/infrastructure/s3/s3.client';
import {
  KEY_PREFIXES,
  SK_VALUES,
} from '../src/shared/infrastructure/dynamodb/single-table.constants';
import { env } from '../src/shared/infrastructure/config/env';

interface SeedProduct {
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  imageSourceUrl: string;
}

const products: SeedProduct[] = [
  {
    name: 'Balón de Fútbol Profesional',
    category: 'futbol',
    price: 350,
    stock: 25,
    description: 'Balón oficial talla 5, costura termosellada.',
    imageSourceUrl: 'https://images.unsplash.com/photo-1614632537190-23e4146777db?w=600',
  },
  {
    name: 'Guantes de Portero Premium',
    category: 'futbol',
    price: 480,
    stock: 15,
    description: 'Látex de alta densidad con protección de dedos.',
    imageSourceUrl:
      'https://images.unsplash.com/photo-1760177379284-b68471fdd217?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    name: 'Botines de Fútbol Pro Strike',
    category: 'futbol',
    price: 720,
    stock: 14,
    description: 'Tachos moldeados, suela ligera para mayor velocidad.',
    imageSourceUrl: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=600',
  },
  {
    name: 'Espinilleras Ligeras de Competición',
    category: 'futbol',
    price: 145,
    stock: 35,
    description: 'Carcasa de polipropileno con espuma EVA absorbente.',
    imageSourceUrl:
      'https://www.sportline.com.gt/media/catalog/product/h/n/hn5603-1-hardware-photography-front-center-view-transparent.png?optimize=medium&bg-color=255,255,255&fit=bounds&height=&width=&canvas=:&format=jpeg',
  },
  {
    name: 'Raqueta de Tenis Profesional',
    category: 'tenis',
    price: 1200,
    stock: 8,
    description: 'Marco de grafito, peso balanceado.',
    imageSourceUrl:
      'https://www.industriadeltenis.com/wp-content/uploads/2023/05/La-importancia-de-elegir-bien-la-raqueta.png',
  },
  {
    name: 'Mancuernas Ajustables 20kg',
    category: 'fitness',
    price: 850,
    stock: 12,
    description: 'Par de mancuernas con discos intercambiables.',
    imageSourceUrl:
      'https://plus.unsplash.com/premium_photo-1671028546491-f70b21a32cc2?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    name: 'Tapete de Yoga Antideslizante',
    category: 'fitness',
    price: 220,
    stock: 30,
    description: 'TPE ecológico, 6mm de grosor.',
    imageSourceUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600',
  },
  {
    name: 'Bandas de Resistencia (Set 5)',
    category: 'fitness',
    price: 175,
    stock: 28,
    description: 'Set de 5 niveles de resistencia con bolsa de transporte.',
    imageSourceUrl: 'https://lycanfitness.co/wp-content/uploads/2021/02/BANDAS-TUBULARES.jpeg',
  },
  {
    name: 'Bicicleta de Montaña Aro 29',
    category: 'ciclismo',
    price: 4500,
    stock: 5,
    description: 'Aluminio, 21 velocidades, suspensión delantera.',
    imageSourceUrl: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=600',
  },
  {
    name: 'Casco de Ciclismo Aerodinámico',
    category: 'ciclismo',
    price: 380,
    stock: 20,
    description: 'Certificación CE, ventilación optimizada.',
    imageSourceUrl:
      'https://images.unsplash.com/photo-1601971360277-7b4c8aa60894?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    name: 'Guantes de Ciclismo con Gel',
    category: 'ciclismo',
    price: 165,
    stock: 26,
    description: 'Palma con gel acolchado, transpirables, antideslizantes.',
    imageSourceUrl:
      'https://images.unsplash.com/photo-1574269909183-f862ca9ae22d?q=80&w=2675&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },

  {
    name: 'Zapatillas Running Pro',
    category: 'running',
    price: 690,
    stock: 18,
    description: 'Amortiguación reactiva, suela de carbono.',
    imageSourceUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
  },
  {
    name: 'Reloj GPS Deportivo',
    category: 'running',
    price: 1850,
    stock: 10,
    description: 'GPS, pulsómetro, batería de 20 horas.',
    imageSourceUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600',
  },
  {
    name: 'Audífonos Deportivos Bluetooth',
    category: 'running',
    price: 520,
    stock: 16,
    description: 'IPX7 a prueba de sudor, hasta 10 horas de música.',
    imageSourceUrl: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600',
  },
];

async function downloadAndUploadImage(productId: string, sourceUrl: string): Promise<string> {
  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`Error descargando imagen: ${response.statusText}, URL: ${sourceUrl}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const key = `products/${productId}.jpg`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: 'image/jpeg',
    }),
  );

  return `${env.S3_ENDPOINT}/${BUCKET_NAME}/${key}`;
}

async function main() {
  console.log('Cargando productos y subiendo imágenes a MinIO...\n');

  const items = [];

  for (const p of products) {
    const id = uuid();
    process.stdout.write(`   ↪ ${p.name}... `);

    let imageUrl: string;
    try {
      imageUrl = await downloadAndUploadImage(id, p.imageSourceUrl);
    } catch (err) {
      console.log(`(error subiendo imagen, usando URL externa)`, err);
      imageUrl = p.imageSourceUrl;
    }

    items.push({
      PutRequest: {
        Item: {
          PK: `${KEY_PREFIXES.PRODUCT}${id}`,
          SK: SK_VALUES.METADATA,
          GSI1PK: 'PRODUCT',
          GSI1SK: id,
          GSI2PK: `${KEY_PREFIXES.CATEGORY}${p.category}`,
          GSI2SK: `${KEY_PREFIXES.PRODUCT}${id}`,
          id,
          name: p.name,
          category: p.category,
          price: p.price,
          stock: p.stock,
          description: p.description,
          imageUrl,
          createdAt: new Date().toISOString(),
        },
      },
    });
  }

  console.log('\n Guardando productos en DynamoDB...');

  const chunks: (typeof items)[] = [];
  for (let i = 0; i < items.length; i += 25) {
    chunks.push(items.slice(i, i + 25));
  }

  for (const chunk of chunks) {
    await dynamoClient.send(
      new BatchWriteCommand({
        RequestItems: {
          [TABLE_NAME]: chunk,
        },
      }),
    );
  }

  console.log(`\n${products.length} productos insertados correctamente.`);
}

main().catch((err) => {
  console.error('Error insertando productos:', err);
  process.exit(1);
});
