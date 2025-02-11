import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import ColorPicker from "./font-color"
import { fontSizes, changeFontSize } from "./font-size"
import { useMainStore } from '@/pinia'

export default {
  name: 'wangEditor',
  props: {
    modelValue: String
  },
  setup(props, { emit }) {
    const mainStore = useMainStore()
    const editor = ref();

    let instance, colorPicker, curContent;

    function htmlChange(newHtml) {
      curContent = newHtml
      emit('update:modelValue', changeFontSize(newHtml))
    }

    function initialize() {
      instance = new window.wangEditor(editor.value);

      colorPicker = new ColorPicker(instance)

      instance.menus.extend('customColor', ColorPicker)

      Object.assign(instance.config, {
        menus: [
          'customColor', //自定义菜单
          'head',
          'bold',
          'fontSize',
          'fontName',
          'italic',
          'underline',
          'strikeThrough',
          'indent',
          'lineHeight',
          // 'foreColor',
          'backColor',
          'link',
          // 'list',
          'justify',
          // 'quote',
          'emoticon',
          // 'image',
          // 'video',
          // 'table',
          // 'code',
          'splitLine',
          // 'undo',
          // 'redo',
        ],
        onchange: htmlChange,
        styleWithCSS: true,
        fontSizes: fontSizes,
        zIndex: 1000
      });
      instance.create();
      instance.txt.html(props.modelValue)
    }

    function pickerColor(v) {
      colorPicker.command(v)
    }

    watch(() => props.modelValue, newVal => {
      if (instance) {
        if (newVal && newVal !== curContent) {
          htmlChange(newVal)
          instance.txt.html(newVal)
        } else if (!newVal) {
          instance.txt.html('')
        }
      }
    })
    onMounted(() => initialize());

    onBeforeUnmount(() => {
      instance.destroy();
      instance = null;
    });

    return () => (
      <div class="wangEditor">
        <el-color-picker predefine={mainStore.predefineColors} show-alpha onActiveChange={pickerColor} class="color-picker" popper-class="editor-color-picker" />
        <div ref={editor}></div>
      </div>
    );
  },
};