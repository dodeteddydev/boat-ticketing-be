import { PrismaClient } from "@prisma/client";
import fetch from "node-fetch";

const prisma = new PrismaClient();

const API_BASE =
  "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/json/";

const fetchData = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(`${API_BASE}${endpoint}.json`);
  return response.json();
};

type CountrySeed = {
  name: string;
  iso2: string;
};

type StateSeed = {
  name: string;
  country_code: string;
  state_code: string;
};

type CitySeed = {
  name: string;
  state_name: string;
  country_code: string;
};

async function main() {
  // Seed Countries
  const countries = await fetchData<CountrySeed[]>("countries");
  for (const country of countries) {
    await prisma.country.create({
      data: {
        country_name: country.name,
        country_code: country.iso2,
        created_by: { connect: { id: 1 } },
      },
    });
  }

  // Seed States
  const states = await fetchData<StateSeed[]>("states");
  for (const state of states) {
    const country = await prisma.country.findUnique({
      where: { country_code: state.country_code },
    });
    if (country) {
      await prisma.province.create({
        data: {
          province_name: state.name,
          province_code: state.state_code,
          country: { connect: { id: country.id } },
          created_by: { connect: { id: 1 } },
        },
      });
    }
  }

  // Seed Cities
  const cities = await fetchData<CitySeed[]>("cities");
  for (const city of cities) {
    const state = await prisma.province.findFirst({
      where: {
        province_name: city.state_name,
        country: { country_code: city.country_code },
      },
    });
    const country = await prisma.country.findUnique({
      where: { country_code: city.country_code },
    });
    if (state && country) {
      await prisma.city.create({
        data: {
          city_name: city.name,
          country: { connect: { id: country.id } },
          province: { connect: { id: state.id } },
          created_by: { connect: { id: 1 } },
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
