import Gallery from 'react-photo-gallery'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'

import Photo from '../photo/photo.component'

import { RenderImageProps } from 'react-photo-gallery'
import { IPhoto } from '../../interfaces/gallery.interfaces'

const SortablePhoto = SortableElement((props: RenderImageProps<IPhoto>) => (
  <Photo {...props} />
))
const SortableGallery = SortableContainer(({ photos }: { photos: IPhoto[] }) => (
  <Gallery
    photos={photos}
    //@ts-ignore
    renderImage={(props: RenderImageProps<IPhoto>) => <SortablePhoto {...props} />}
  />
))

export default SortableGallery
