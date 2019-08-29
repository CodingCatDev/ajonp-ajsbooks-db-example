const admin = require('firebase-admin');

const crud = require('./crud');
const bookConfig = require('./data/bookConfig');
const faker = require('faker');

const BOOKS = 5;
const CHAPTERSPERBOOK = 5;
const PAGESPERCHAPTER = 25;

const booksPics = [
  'https://res.cloudinary.com/ajonp/image/upload/w_500,h_500,q_auto/ajonp-ajonp-com/20-lesson-nextjs/5-Firebase/krists-luhaers-BdOj5h38TSQ-unsplash.jpg',
  'https://res.cloudinary.com/ajonp/image/upload/w_500,h_500,q_auto/ajonp-ajonp-com/20-lesson-nextjs/5-Firebase/sharon-mccutcheon-eMP4sYPJ9x0-unsplash.jpg',
  'https://res.cloudinary.com/ajonp/image/upload/w_500,h_500,q_auto/ajonp-ajonp-com/20-lesson-nextjs/5-Firebase/francesca-tirico-_ea1a8mZTcE-unsplash.jpg',
  'https://res.cloudinary.com/ajonp/image/upload/w_500,h_500,q_auto/ajonp-ajonp-com/20-lesson-nextjs/5-Firebase/thought-catalog-V5BGaJ0VaLU-unsplash.jpg',
  'https://res.cloudinary.com/ajonp/image/upload/w_500,h_500,q_auto/ajonp-ajonp-com/20-lesson-nextjs/5-Firebase/annelies-geneyn-bhBONc07WsI-unsplash.jpg',
  'https://res.cloudinary.com/ajonp/image/upload/w_500,h_500,q_auto/ajonp-ajonp-com/20-lesson-nextjs/5-Firebase/hope-house-press-leather-diary-studio-IOzk8YKDhYg-unsplash.jpg',
  'https://res.cloudinary.com/ajonp/image/upload/w_500,h_500,q_auto/ajonp-ajonp-com/20-lesson-nextjs/5-Firebase/aaron-burden-9zsHNt5OpqE-unsplash.jpg',
  'https://res.cloudinary.com/ajonp/image/upload/w_500,h_500,q_auto/ajonp-ajonp-com/20-lesson-nextjs/5-Firebase/patrick-tomasso-Oaqk7qqNh_c-unsplash.jpg',
  'https://res.cloudinary.com/ajonp/image/upload/w_500,h_500,q_auto/ajonp-ajonp-com/20-lesson-nextjs/5-Firebase/thought-catalog-o0Qqw21-0NI-unsplash.jpg'
];

/* Because in our system a book cannot exist without an Author, we must first create an author */

/* Create new Author */

const author = {
  createdAt: admin.firestore.Timestamp.fromDate(new Date()),
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

  for (let i = 1; i <= BOOKS; i++) {
    const fic = faker.random.boolean(); //Decide whether this is a fiction book
    const title = faker.commerce.productName();
    const book = {
      ageCategory: faker.random.objectElement(bookConfig.ageCategory),
      authorDisplayName: author.displayName,
      authorId: authorRef.id,
      createdAt: admin.firestore.Timestamp.fromDate(new Date()),
      description: faker.lorem.paragraph(),
      cover: faker.random.arrayElement(booksPics),
      fiction: fic,
      genre: fic
        ? faker.random.arrayElement(bookConfig.fiction)
        : faker.random.arrayElement(bookConfig.nonFiction),
      hasAudio: faker.random.boolean(),
      hasPhotos: faker.random.boolean(),
      hasVideos: faker.random.boolean(),
      publishDate: false,
      rating: faker.random.number({ min: 0, max: 5, precision: 1 }),
      slug: faker.helpers.slugify(title),
      status: faker.random.arrayElement(bookConfig.status),
      title: title
    };

    const bookRef = await crud.createDoc('books', book);

    /* This is just for sample, after the functions part of lesson this should happen automatiacally */
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
      id: authorRef.id,
      updatedAt: admin.firestore.Timestamp.fromDate(new Date())
    });

    const chapters = [];
    let totalPages = 0;

    /* Add Chapters per Book*/
    for (
      let chapterIndex = 1;
      chapterIndex <= CHAPTERSPERBOOK;
      chapterIndex++
    ) {
      const chapter = {
        number: chapterIndex,
        createdAt: admin.firestore.Timestamp.fromDate(new Date()),
        photo: faker.image.image(),
        title: faker.commerce.productName()
      };
      const chapterRef = await crud.createDoc(
        `books/${bookRef.id}/chapters`,
        chapter
      );

      // Add chapter to books array
      chapters.push({
        id: chapterRef.id,
        number: chapter.number,
        photo: chapter.photo,
        title: chapter.title
      });

      let pages = [];

      /* Add Pages per Chapter */
      for (let pageIndex = 1; pageIndex <= PAGESPERCHAPTER; pageIndex++) {
        totalPages++;

        const page = {
          number: totalPages,
          text: faker.lorem.paragraphs()
        };

        const pageRef = await crud.createDoc(
          `books/${bookRef.id}/chapters/${chapterRef.id}/pages`,
          page
        );

        pages.push({
          id: pageRef.id,
          number: totalPages
        });
        crud.updateDoc(
          `books/${bookRef.id}/chapters/${chapterRef.id}/pages`,
          pageRef.id,
          {
            id: pageRef.id
          }
        );
      }

      /* Update chapter with pages array */
      crud.updateDoc(`books/${bookRef.id}/chapters/`, chapterRef.id, {
        pages: pages,
        id: chapterRef.id
      });
    }
    /* Update book with chapters array */
    crud.updateDoc('books', bookRef.id, {
      chapters: chapters,
      totalPages: totalPages
    });
  }
});
