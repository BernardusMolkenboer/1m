exports.up = function (knex) {
  return knex.schema.createTable("Pixels", function (table) {
    table.increments("id").primary();
    table.integer("x").notNullable();
    table.integer("y").notNullable();
    table.string("owner").nullable();
    table.text("image_url").nullable();
    table.text("link_url").nullable();
    table.boolean("is_owned").defaultTo(false);
    table.string("color").defaultTo("gray"); // Add color column
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("Pixels");
};
