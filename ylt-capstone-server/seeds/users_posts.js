import users from '../seed-data/users.js';

export async function seed(knex) {
  await knex('users').truncate();

  const formattedUsers = users.map(user => ({
    ip: user.ip,
    machine: user.machine,
    palette: JSON.stringify(user.palette),
    theme: user.theme
  }));

  await knex('users').insert(formattedUsers);
}