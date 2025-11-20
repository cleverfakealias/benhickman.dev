import blockContent from './blockContent'
import category from './category'
import post from './post'
import author from './author'
import homePage, {
    homeContentSectionModule,
    homeCta,
    homeHeroModule,
    homeImageAsset,
    homeResponsiveImagePipeline,
} from './home/homePage'

export const schemaTypes = [
    post,
    author,
    category,
    blockContent,
    homePage,
    homeHeroModule,
    homeContentSectionModule,
    homeCta,
    homeResponsiveImagePipeline,
    homeImageAsset,
]
