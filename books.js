const crud = require('./crud');
const bookConfig = require('./data/bookConfig');
const faker = require('faker');

/* Because in our system a book cannot exist without an Author, we must first create an author */

/* Create new Author */

const author = {
  displayName: faker.internet.userName(),
  email: faker.internet.email(),
  name: faker.name.findName(),
  profileImage: faker.internet.avatar(),
  social: {
    facebook: false,
    github: false,
    linkedIn: false,
    twitter: false
  },
  summary: faker.lorem.paragraph(),
  uid: false,
  website: 'http://ajonp.com'
};

crud.createDoc('authors', author).then(async authorRef => {
  /* Create x number of books for each Author */

  for (let i = 0; i < 5; i++) {
    const fic = faker.random.boolean(); //Decide whether this is a fiction book
    const book = {
      ageCategory: faker.random.objectElement(bookConfig.ageCategory),
      authorDisplayName: author.displayName,
      authorId: authorRef.id,
      description: faker.lorem.paragraph(),
      cover: faker.image.cats(),
      fiction: fic,
      genre: fic
        ? faker.random.arrayElement(bookConfig.fiction)
        : faker.random.arrayElement(bookConfig.nonFiction),
      hasAudio: faker.random.boolean(),
      hasPhotos: faker.random.boolean(),
      hasVideos: faker.random.boolean(),
      publishDate: false,
      rating: faker.random.number({ min: 0, max: 5, precision: 1 }),
      status: faker.random.arrayElement(bookConfig.status),
      title: faker.lorem.sentence()
    };

    /* This is just for sample, after the functions part of lesson this should happen automatiacally */
    const bookRef = await crud.createDoc('books', book);

    //Update this book with its own id
    crud.updateDoc('books', bookRef.id, { id: bookRef.id });

    //Update the author to include book
    const authorBook = {
      title: book.title,
      id: bookRef.id
    };
    const authorDoc = await authorRef.get();
    const authorBooks = authorDoc.data().books || [];
    authorBooks.push(authorBook);

    crud.updateDoc('authors', authorRef.id, {
      books: authorBooks,
      id: authorRef.id
    });
  }
});
