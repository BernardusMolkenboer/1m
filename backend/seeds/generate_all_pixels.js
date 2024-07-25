exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("Pixels")
    .del()
    .then(function () {
      // Define the grid size
      const gridSize = 1000;
      const pixels = [];

      // Generate all pixels
      for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
          pixels.push({
            x: x,
            y: y,
            owner: null, // No owner initially
            image_url: null,
            link_url: null,
            color: "gray", // Default color for empty pixels
            is_owned: false, // Indicating that the pixel is not owned
          });
        }
      }

      // Insert all pixels into the database
      return knex("Pixels").insert(pixels);
    });
};
