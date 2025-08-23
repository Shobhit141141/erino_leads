const { faker } = require('@faker-js/faker');
const { sequelize } = require('../config/db');
const Lead = require('../models/Lead');

async function seedLeads(count = 60) {
  await sequelize.sync();
  const leads = [];
  for (let i = 0; i < count; i++) {
    leads.push({
      userId: 3, 
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      company: faker.company.name(),
      city: faker.location.city(),
      state: faker.location.state(),
      source: faker.helpers.arrayElement(['website', 'facebook_ads', 'google_ads', 'referral', 'events', 'other']),
      status: faker.helpers.arrayElement(['new', 'contacted', 'qualified', 'lost', 'won']),
      score: faker.number.int({ min: 0, max: 100 }),
      lead_value: faker.number.float({ min: 100, max: 10000, precision: 0.01 }),
      last_activity_at: faker.date.recent(),
      is_qualified: faker.datatype.boolean(),
    });
  }
  await Lead.bulkCreate(leads);
  console.log(`${count} leads seeded!`);
  process.exit(0);
}

seedLeads();
