import { Group, text, gravity, Color, LayoutSpec, vlayout, hlayout, layoutConfig, scroller, Text, ViewHolder, VMPanel, ViewModel, network, loge, HLayout, stack, image, Gravity, takeNonNull, Scroller, Image } from "doric";
import { colors } from "./utils";
import MovieData from './movie.json'

interface DoubanModel {
    count: number
    start: number
    total: number
    subjects: Array<{
        rating: {
            max: number,
            average: number,
            details: {
                "1": number,
                "2": number,
                "3": number,
                "4": number,
                "5": number,
            },
            stars: string
            min: number,
        }
        genres: string[],
        title: string
        casts: Array<{
            avatars: {
                small: string,
                large: string,
                medium: string,
            },
            name_en: string
            name: string
            alt: string
            id: string
        }>
        durations: string[]
        collect_count: number
        mainland_pubdate: string
        has_video: boolean
        original_title: string
        subtype: string
        directors: Array<{
            avatars: {
                small: string,
                large: string,
                medium: string,
            },
            name_en: string
            name: string
            alt: string
            id: string
        }>,
        pubdates: string[],

        year: string,
        images: {
            small: string,
            large: string,
            medium: string,
        }
        alt: string
        id: string
    }>
    title: string
}

interface MovieModel {
    doubanModel?: DoubanModel
    selectedIdx: number
}

class MovieVH extends ViewHolder {
    title!: Text
    gallery!: HLayout
    scrolled!: Scroller
    movieTitle!: Text
    movieYear!: Text

    build(root: Group) {
        vlayout(
            [
                this.title = text({
                    layoutConfig: {
                        widthSpec: LayoutSpec.MOST,
                        heightSpec: LayoutSpec.JUST,
                    },
                    textSize: 30,
                    textColor: Color.WHITE,
                    backgroundColor: colors[1],
                    textAlignment: gravity().center(),
                    height: 50,
                }),
                this.scrolled = scroller(
                    this.gallery = hlayout(
                        [],
                        {
                            layoutConfig: layoutConfig().fit(),
                            space: 0,
                            padding: {
                                top: 20,
                                left: 20,
                                right: 20,
                                bottom: 20,
                            },
                            gravity: Gravity.Center,
                        }),
                    {
                        layoutConfig: layoutConfig().most().configHeight(LayoutSpec.FIT),
                        backgroundColor: Color.parse("#eeeeee"),
                    }),
                vlayout(
                    [
                        text({
                            text: "↑",
                        }),
                        this.movieTitle = text({
                            textSize: 20,
                        }),
                        this.movieYear = text({
                            textSize: 20,
                        }),
                    ],
                    {
                        layoutConfig: layoutConfig().fit().configWidth(LayoutSpec.MOST),
                        gravity: Gravity.Center
                    }),
            ],
            {
                layoutConfig: layoutConfig().most(),
                space: 0,
            }).in(root)
    }

}

class MovieVM extends ViewModel<MovieModel, MovieVH>{
    images: Map<number, Image> = new Map

    onAttached(state: MovieModel, vh: MovieVH) {
        network(context).get("https://douban.uieee.com/v2/movie/top250").then(ret => {
            this.updateState(state => state.doubanModel = JSON.parse(ret.data) as DoubanModel)
        })
        vh.scrolled.onScroll = (offset) => {
            const frameWidth = 270 / 2 * 1.5
            const centerX = offset.x + Environment.screenWidth / 2
            const idx = Math.floor(centerX / frameWidth)
            if (state.selectedIdx != idx) {
                this.updateState(state => state.selectedIdx = idx)
            }
            const overOff = Math.abs(centerX - frameWidth * (idx + 0.5))
            const scale = overOff / (frameWidth / 2)
            takeNonNull(this.images.get(idx))(v => {
                v.scaleX = v.scaleY = 1.5 - 0.5 * scale
            })
        }
    }

    onBind(state: MovieModel, vh: MovieVH) {
        if (state.doubanModel) {
            vh.title.text = state.doubanModel.title
            vh.gallery.children.length = 0
            state.doubanModel.subjects.forEach((e, idx) => {
                vh.gallery.addChild(stack(
                    [
                        image({
                            layoutConfig: layoutConfig().just().configAlignment(Gravity.Center),
                            width: 270 / 2,
                            height: 400 / 2,
                            imageUrl: e.images.large,
                            onClick: function () {
                                const v = (this as Image).superview
                                if (v == undefined) {
                                    return
                                }
                                v.getLocationOnScreen(context).then(ret => {
                                    const centerX = ret.x + v.width / 2;
                                    vh.scrolled.scrollBy(context, { x: centerX - Environment.screenWidth / 2, y: 0 }, true)
                                })
                            },
                        }).also(it => {
                            this.images.set(idx, it)
                        })
                    ],
                    {
                        layoutConfig: layoutConfig().just(),
                        width: 270 / 2 * 1.5,
                        height: 400 / 2 * 1.5,
                    }))
            })
            takeNonNull(state.doubanModel.subjects[state.selectedIdx])(it => {
                vh.movieTitle.text = it.title
                vh.movieYear.text = it.year
            })
        }
    }
}

@Entry
class SliderPanel extends VMPanel<MovieModel, MovieVH>{
    getViewModelClass() {
        return MovieVM
    }
    getViewHolderClass() {
        return MovieVH
    }

    getState() {
        return { selectedIdx: 0, doubanModel: MovieData }
    }

}