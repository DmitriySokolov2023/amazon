import { PrismaClient, Product } from '@prisma/client';
import * as dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import { getSlug } from '../src/utils/generate-slug';
import { getRandomNumber } from '../src/utils/random-number';

dotenv.config();

const prisma = new PrismaClient();

const createProduct = async (quantity: number) => {
  const products: Product[] = [];

  for (let i = 0; i < quantity; i++) {
    const productName = faker.commerce.productName();
    const categoryName = faker.commerce.department();

    const product = await prisma.product.create({
      data: {
        name: productName,
        slug: getSlug(productName),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(10, 999, 0),
        images: Array.from({ length: getRandomNumber(2, 6) }).map(() =>
          faker.image.imageUrl(),
        ),
        category: {
          create: {
            name: categoryName,
            slug:getSlug(categoryName)
          },
        },
        reviews: {
          create: [
            {
              rating: faker.datatype.number({ min: 1, max: 5 }),
              text: faker.lorem.paragraph(),
              user: {
                connect: {
                  id: 8,
                },
              },
            },
            {
              rating: faker.datatype.number({ min: 1, max: 5 }),
              text: faker.lorem.paragraph(),
              user: {
                connect: {
                  id: 8,
                },
              },
            }
            ],
        },

      },
    });
    products.push(product)
  }

  console.log(`create ${products.length}`);
};

async function main() {
  console.log('Starting seeding...');
  await createProduct(10);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });