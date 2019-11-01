import { vlayout, Image, ViewHolder, VMPanel, ViewModel, Gravity, NativeCall, Text, Color, log, logw, loge, Group, LayoutSpec, } from "doric"


interface CountModel {
    count: number
}

class CounterView extends ViewHolder<CountModel> {

    number!: Text
    counter!: Text
    build(root: Group) {
        root.addChild(vlayout([
            () => {
                return (new Text).also(it => {
                    it.textSize = 40
                    it.layoutConfig = {
                        alignment: new Gravity().center()
                    }
                    this.number = it
                })
            },
            () => {
                return (new Text).also(it => {
                    it.text = "点击计数"
                    it.textSize = 20

                    it.border = {
                        width: 1,
                        color: Color.parse('#000000'),
                    }
                    it.corners = 5

                    it.layoutConfig = {
                        alignment: new Gravity().center()
                    }
                    it.shadow = {
                        color: Color.parse("#00ff00"),
                        opacity: 0.5,
                        radius: 20,
                        offsetX: 10,
                        offsetY: 10,
                    }
                    this.counter = it
                })
            },
        ]).also(it => {
            it.width = 200
            it.height = 200
            it.space = 20
            it.gravity = new Gravity().center()
            it.layoutConfig = {
                alignment: new Gravity().center()
            }
            it.border = {
                width: 1,
                color: Color.parse("#000000"),
            }
            it.shadow = {
                color: Color.parse("#ffff00"),
                opacity: 0.5,
                radius: 20,
                offsetX: 10,
                offsetY: 10,
            }
            it.corners = 20
            it.bgColor = Color.parse('#ff00ff')
        }))

        root.addChild((new Image).also(iv => {
            iv.imageUrl = "https://misc.aotu.io/ONE-SUNDAY/SteamEngine.png"
            iv.layoutConfig = {
                widthSpec: LayoutSpec.WRAP_CONTENT,
                heightSpec: LayoutSpec.WRAP_CONTENT,
            }
        }))
    }

    bind(state: CountModel) {
        this.number.text = `${state.count}`
    }

    setCounter(v: Function) {
        this.counter.onClick = v
    }
}

class CounterVM extends ViewModel<CountModel, CounterView> {
    onAttached(s: CountModel, vh: CounterView): void {
        vh.counter.onClick = () => {
            this.updateState(state => {
                state.count++
            })
        }
    }
}

@Entry
class MyPage extends VMPanel<CountModel, CounterView>{


    getViewHolderClass() {
        return CounterView
    }

    getViewModelClass() {
        return CounterVM
    }

    getState(): CountModel {
        return {
            count: 0
        }
    }


    @NativeCall
    log() {
        log("Hello.HEGO")
        logw("Hello.HEGO")
        loge("Hello.HEGO")
        context.modal.toast('This is a toast.').then((r) => {
            loge(r)
        })
    }
}