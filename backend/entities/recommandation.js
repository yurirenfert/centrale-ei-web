import typeorm from 'typeorm';

const Recommandation = new EntitySchema({
    name: 'Recommandation',
    columns: {
      user_id: { primary: true, type: 'int' },
      movie_id: { primary: true, type: 'int' },
      score: { type: 'float', nullable: false },
      ranking: { type: 'int', nullable: false },
    },
    relations: {
      user: {
        type: 'many-to-one',
        target: 'User',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        onDelete: 'CASCADE',
      },
      movie: {
        type: 'many-to-one',
        target: 'Movie',
        joinColumn: { name: 'movie_id', referencedColumnName: 'id' },
        onDelete: 'CASCADE',
      },
    },
  });
  
  export default Recommandation;
