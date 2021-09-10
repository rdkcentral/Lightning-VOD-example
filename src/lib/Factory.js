import { Strip, Item} from "@/components"

export const createPageComponents = (strips) => {
    return strips.map(({title, items}) => {
        return {type: Strip, itemType: Item, h: Item.height + 80, title, items: items.map((item) => {
            return {item: applyItemModel(item)}
        })}
    });
}

const applyItemModel = (item) => {
    const {id, title, name, media_type, overview, poster_path, backdrop_path} = item;
    return {
        id,
        title: media_type === 'tv' ? name : title,
        description: overview,
        poster: `http://image.tmdb.org/t/p/w185/${poster_path}`,
        backdrop: `http://image.tmdb.org/t/p/original/${backdrop_path}`
    }
}