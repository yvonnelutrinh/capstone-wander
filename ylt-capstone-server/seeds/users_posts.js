import users from '../seed-data/user-palettes.js';

export async function seed(knex) {
  await knex('users').truncate();

  const formattedUsers = users.map(user => ({
    ip: user.ip,
    machine: user.machine,
    palette: JSON.stringify(user.palette)
  }));

  await knex('users').insert(formattedUsers);
}