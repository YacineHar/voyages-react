export default function AboutPage() {
  return (
    <>
      <h1 className='mb-4'>À propos</h1>
      <p>
        Voyages est une application réalisée en React dans le cadre d'un exercice. Le but est de
        présenter plusieurs destinations à travers le monde et de pouvoir consulter le détail de chacune.
      </p>
      <h2 className='fs-4 mt-4'>Ce que vous pouvez faire</h2>
      <ul>
        <li>Voir la liste de toutes les destinations</li>
        <li>Consulter la page détail d'un pays avec sa capitale et sa description</li>
        <li>Rechercher une destination par nom, capitale ou région</li>
        <li>Créer un compte, ajouter des favoris et laisser des commentaires</li>
        <li>Passer le site en mode sombre ou clair</li>
      </ul>
      <h2 className='fs-4 mt-4'>Technologies utilisées</h2>
      <p>React, Redux Toolkit, React Router, React Bootstrap, React Hook Form et Yup. Les données viennent de l'API du cours.</p>
      <p className='text-muted'>Les images proviennent de Pixabay.</p>
    </>
  )
}
