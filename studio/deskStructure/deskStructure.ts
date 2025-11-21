import {StructureBuilder} from 'sanity/structure'
import {ORGANIZATIONS} from '../lib/organizations'

const orgFilter = '_type == "post" && organizationId == $orgId'

const homeDocumentId = (orgId: string) => `homePage-${orgId}`

const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Home Pages')
        .child(
          S.list()
            .title('Home Pages')
            .items(
              ORGANIZATIONS.map((org) =>
                S.listItem()
                  .title(org.title)
                  .child(
                    S.document()
                      .schemaType('homePage')
                      .documentId(homeDocumentId(org.id))
                      .title(`${org.title} Home Page`),
                  ),
              ),
            ),
        ),

      S.divider(),
      S.listItem().title('Posts (All)').child(S.documentTypeList('post').title('All Posts')),

      // Organization-specific post lists
      ...ORGANIZATIONS.map((org) =>
        S.listItem()
          .title(`${org.title} Posts`)
          .child(
            S.documentList()
              .title(`${org.title} Posts`)
              .filter(orgFilter)
              .params({orgId: org.id})
              .apiVersion('2024-10-18'),
          ),
      ),

      S.divider(),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('author').title('Authors'),
    ])

export default deskStructure
