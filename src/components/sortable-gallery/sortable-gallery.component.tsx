import Gallery, { RenderImageProps } from 'react-photo-gallery-react17'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'

import Photo from '../photo/photo.component'

import { IPhoto } from '../../interfaces/gallery.interfaces'

const SortablePhoto = SortableElement((props: RenderImageProps<IPhoto>) => (
  <Photo {...props} />
))
const SortableGallery = SortableContainer(({ photos }: { photos: IPhoto[] }) => (
  <Gallery
    photos={photos}
    margin={3}
    //@ts-ignore
    renderImage={(props: RenderImageProps<IPhoto>) => <SortablePhoto {...props} />}
  />
))

export default SortableGallery
