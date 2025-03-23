export async function up(knex) {
    return knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('ip').notNullable();
      table.string('machine').unique().notNullable();
      table.json('palette').notNullable();
      table.timestamps(true, true);  //
    });
  }
  
  export async function down(knex) {
    return knex.schema.dropTableIfExists('users');
  }  