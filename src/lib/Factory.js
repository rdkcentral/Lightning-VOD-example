import { Strip, Item} from "@/components"

export const createPageComponents = (strips) => {
    return strips.map(({title, media_type, items}) => {
        return {type: Strip, itemType: Item, h: Item.height + 80, title, index: 0, items: createItemCollection(items, media_type)}
    });
}

export const createItemCollection = (items, media_type = 'tv') => {
    return items.map((item) => {
        return {item: applyItemModel({media_type, ...item})}
    })
};

export const applyItemModel = (item) => {
    const {id, title, name, media_type = 'tv', number_of_episodes, number_of_seasons, genres, runtime, overview, poster_path, backdrop_path} = item;
    return {
        id,
        media_type,
        number_of_episodes,
        number_of_seasons,
        genres,
        runtime,
        title: media_type === 'tv' ? name : title,
        description: overview,
        poster: `http://image.tmdb.org/t/p/w185/${poster_path}`,
        large_poster: `http://image.tmdb.org/t/p/w300/${poster_path}`,
        backdrop: `http://image.tmdb.org/t/p/original/${backdrop_path}`
    }
}

export const applyPlayerModel = (item) => {
    const {id, title, name, media_type, images: {backdrops}} = item;
    const backdropPath = backdrops.length > 0 ? backdrops[Math.min(1, backdrops.length-1)].file_path : '';
    return {
        id,
        title: media_type === 'tv' ? name : title,
        backdrop: `http://image.tmdb.org/t/p/original/${backdropPath}`
    }
} 