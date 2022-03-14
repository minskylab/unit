import { getPublicKeyList } from '../../../../../../api/keys'
import { addListeners } from '../../../../../../client/addListener'
import { linearTransition } from '../../../../../../client/animation/animation'
import { ANIMATION_T_S } from '../../../../../../client/animation/ANIMATION_T_S'
import { Component } from '../../../../../../client/component'
import mergeProps from '../../../../../../client/component/mergeProps'
import mergePropStyle from '../../../../../../client/component/mergeStyle'
import { makeCustomListener } from '../../../../../../client/event/custom'
import { makeClickListener } from '../../../../../../client/event/pointer/click'
import { makePointerEnterListener } from '../../../../../../client/event/pointer/pointerenter'
import { makePointerLeaveListener } from '../../../../../../client/event/pointer/pointerleave'
import { findRef } from '../../../../../../client/findRef'
import { randomNaturalBetween } from '../../../../../../client/math'
import { Mode } from '../../../../../../client/mode'
import parentElement from '../../../../../../client/platform/web/parentElement'
import {
  COLOR_NONE,
  getActiveColor,
  getThemeModeColor,
  randomColorString,
} from '../../../../../../client/theme'
import { Pod } from '../../../../../../pod'
import { System } from '../../../../../../system'
import { Dict } from '../../../../../../types/Dict'
import { IHTMLDivElement } from '../../../../../../types/global/dom'
import { Unlisten } from '../../../../../../types/Unlisten'
import { rangeArray } from '../../../../../../util/array'
import Unplugged from '../../../../../host/component/Unplugged/Component'
import TextDiv from '../../../../core/component/TextDiv/Component'
import Div from '../../../Div/Component'
import Icon from '../../../Icon/Component'
import { enableModeKeyboard } from '../../Graph/enableModeKeyboard'
import Modes from '../../Modes/Component'

export interface Props {
  style?: Dict<string>
}

export const DEFAULT_STYLE = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'currentColor',
  borderRadius: '3px',
  overflowY: 'auto',
  overflowX: 'hidden',
}

export const BUTTON_STYLE = {
  width: '33px',
  height: '33px',
  padding: '6px',
  boxSizing: 'border-box',
  cursor: 'pointer',
  borderRadius: '3px',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: COLOR_NONE,
}

export default class UserControl extends Component<IHTMLDivElement, Props> {
  private _root: Div

  private _unplugged: Unplugged

  private _hex_text: TextDiv

  private _selected: number = 0
  private _active: number = 0

  private _pointer_inside: boolean = false

  private _public_keys: string[] = []

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { style } = $props

    const { theme } = $system

    const root = new Div(
      {
        style: {
          ...DEFAULT_STYLE,
          ...style,
        },
        tabIndex: 0,
      },
      this.$system,
      this.$pod
    )
    this._root = root

    this._root.addEventListeners([
      makePointerEnterListener(() => {
        // console.log('UserControl', 'on_pointer_enter')

        this._pointer_inside = true

        this._refresh_color()
      }),
      makePointerLeaveListener(() => {
        // console.log('UserControl', 'on_pointer_leave')

        this._pointer_inside = false

        this._refresh_color()
      }),
      makeClickListener({
        onClick: () => {
          if (this._mode === 'data') {
            this._set_active_identity(this._selected)
          }
        },
      }),
    ])

    const unplugged = new Unplugged(
      {
        style: {
          display: 'inline-block',
          width: '100%',
          height: 'calc(80% - 9px)',
          transition: linearTransition('color'),
          cursor: 'pointer',
        },
      },
      this.$system,
      this.$pod
    )
    unplugged.addEventListener(
      makeClickListener({
        onClick: async () => {
          if (this._mode === 'add') {
            const {
              api: {
                clipboard: { writeText },
              },
            } = this.$system

            const address = this._public_key_addr[this._selected]

            try {
              await writeText(`'${address}'`)
            } catch (err) {
              // swallow
            }
          }
        },
      })
    )
    this._unplugged = unplugged

    const hex_text = new TextDiv(
      {
        value: randomColorString().replace('#', '0x'),
        style: {
          fontSize: '15px',
          // fontWeight: '600',
          textAlign: 'center',
          height: '30px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: linearTransition('color'),
          cursor: 'pointer',
          color: 'currentColor',
        },
      },
      this.$system,
      this.$pod
    )
    this._hex_text = hex_text

    const scope_list = new Div(
      {
        style: {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: '12px',
          height: '39px',
          marginBottom: '6px',
          overflow: 'auto',
          transition: `height ${ANIMATION_T_S}s linear, opacity ${ANIMATION_T_S}s linear`,
        },
      },
      this.$system,
      this.$pod
    )

    const memory = this._create_button('memory', 'cpu')
    const session = this._create_button('session', 'sliders')
    const local = this._create_button('local', 'home')

    scope_list.registerParentRoot(memory)
    scope_list.registerParentRoot(session)
    scope_list.registerParentRoot(local)

    this._select_button('local')

    const $element = parentElement($system)

    this.$element = $element
    this.$slot = root.$slot
    this.$subComponent = {
      root,
    }
    this.$unbundled = false

    this.registerRoot(root)

    root.registerParentRoot(unplugged)
    root.registerParentRoot(hex_text)
    ;(async () => {
      const public_keys = await getPublicKeyList(this.$system)

      this._public_keys = public_keys

      const public_key_active: boolean[] = [true, false, false]

      this._public_key_code = public_keys.map(() => {
        return rangeArray(6).map(() => randomNaturalBetween(0, 10))
      })

      this._public_key_addr = public_keys.map(() => {
        return randomColorString().replace('#', '0x')
      })

      const l = public_keys.length

      const active = public_key_active[0]

      const color = active ? getActiveColor(theme) : 'currentColor'

      mergeProps(this._unplugged, {
        id: this._public_key_code[0],
      })

      this._set_color(color)
    })()
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'style') {
      this._root.setProp('style', {
        ...DEFAULT_STYLE,
        ...current,
      })
    }
  }

  private _selected_button: string | null = null
  private _button: Dict<Icon> = {}

  private _create_button = (
    name: string,
    icon: string,
    component: Component | null = null
  ): Icon => {
    const button = new Icon(
      {
        icon,
        style: {
          ...BUTTON_STYLE,
        },
      },
      this.$system,
      this.$pod
    )
    button.addEventListener(
      makeClickListener({
        onClick: () => {
          this._select_button(name)
        },
      })
    )
    this._button[name] = button

    return button
  }

  private _select_button = (name: string): void => {
    if (this._selected_button) {
      const selected_button = this._button[this._selected_button]
      mergePropStyle(selected_button, {
        borderColor: COLOR_NONE,
      })
    }

    this._selected_button = name

    const button = this._button[name]

    mergePropStyle(button, {
      borderColor: 'currentColor',
    })
  }

  private _public_key_code: number[][]
  private _public_key_addr: string[]

  onMount(): void {
    const modes = findRef(this, 'modes') as Modes | null

    this._modes = modes

    if (this._modes) {
      this._enable_modes()
    }

    this._enable_mode_shortcut()

    addListeners(this.$context, [
      makeCustomListener('themechanged', () => {
        this._refresh_color()
      }),
    ])
  }

  onUnmount() {
    if (this._modes) {
      this._disable_modes
    }

    this._disable_mode_shortcut()
  }

  private _unlisten_mode_keyboard: Unlisten | undefined = undefined

  private _modes: Modes | null = null
  private _mode: Mode = 'none'

  private _unlisten_modes: Unlisten | undefined

  private _enable_modes = (): void => {
    if (this._modes) {
      if (!this._unlisten_modes) {
        // console.log('UserControl', '_enable_modes')
        this._unlisten_modes = this._modes.addEventListeners([
          makeCustomListener('entermode', this._on_enter_mode),
        ])

        this._modes.setProp('mode', this._mode)

        this._mode = this._modes.getMode()
      }
    }
  }

  private _disable_modes = (): void => {
    if (this._unlisten_modes) {
      // console.log('Graph', '_disable_modes')
      this._unlisten_modes()
      this._unlisten_modes = undefined
    }
  }

  private _enable_mode_shortcut = (): void => {
    // console.log('UserControl', '_enable_mode_shortcut')
    this._unlisten_mode_keyboard = enableModeKeyboard(
      this._root,
      (mode: Mode) => {
        if (this._modes) {
          this._modes.setProp('mode', mode)
        }
      }
    )
  }

  private _disable_mode_shortcut = (): void => {
    // console.log('UserControl', '_disable_mode_shortcut')
    if (this._unlisten_mode_keyboard) {
      this._unlisten_mode_keyboard()
      this._unlisten_mode_keyboard = undefined
    }
  }

  private _set_color = (color: string): void => {
    mergePropStyle(this._unplugged, {
      color,
    })
    mergePropStyle(this._hex_text, {
      color,
    })
  }

  private _set_default_color = () => {
    const { $theme } = this.$context

    if (this._selected === this._active) {
      this._set_color(getActiveColor($theme))
    } else {
      // this._set_color(COLOR_WHITE)
      this._set_color('currentColor')
    }
  }

  private _refresh_color = () => {
    const { $theme } = this.$context

    if (this._mode === 'none') {
      this._set_default_color()
    } else if (this._mode === 'data') {
      this._set_color(getThemeModeColor($theme, 'data', 'currentColor'))
    } else if (this._mode === 'add') {
      this._set_color(getThemeModeColor($theme, 'add', 'currentColor'))
    } else if (this._mode === 'remove') {
      this._set_color(getThemeModeColor($theme, 'remove', 'currentColor'))
    } else if (this._mode === 'change') {
      this._set_color(getThemeModeColor($theme, 'change', 'currentColor'))
    }
  }

  private _on_enter_mode = ({ mode }: { mode: Mode }) => {
    const prev_mode = this._mode

    this._mode = mode

    this._refresh_color()

    // if (this._mode === 'add' && prev_mode !== 'add') {
    //   this._add_new_identity()
    // } else if (this._mode !== 'add' && prev_mode === 'add') {
    //   this._remove_new_identity()
    // }
  }

  private _set_active_identity(index: number) {
    const { $theme } = this.$context

    console.log('UserControl', '_set_active_identity', index)

    if (this._active === index) {
      this._active = -1

      this._refresh_color()
    } else {
      this._active = index
    }
  }
}
