<template>
  <div class="preview-image">
    <!-- 缩略图 -->
    <img
      :src="src"
      :style="thumbStyle"
      class="preview-thumb"
      @click="open"
    />

    <!-- 预览 Modal -->
    <a-modal
      :visible="visible"
      :footer="null"
      :width="modalWidth"
      @cancel="close"
      centered
    >
      <div class="preview-image-wrapper">
        <img :src="src" class="preview-image-large" />
      </div>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: 'PreviewImage',

  props: {
    /** 图片地址 */
    src: {
      type: String,
      required: true
    },

    /** 缩略图宽度 */
    width: {
      type: [Number, String],
      default: 80
    },

    /** 缩略图高度 */
    height: {
      type: [Number, String],
      default: 80
    },

    /** Modal 宽度 */
    modalWidth: {
      type: [Number, String],
      default: '80%'
    }
  },

  data() {
    return {
      visible: false
    }
  },

  computed: {
    thumbStyle() {
      const format = v =>
        typeof v === 'number' ? `${v}px` : v

      return {
        width: format(this.width),
        height: format(this.height)
      }
    }
  },

  methods: {
    open() {
      this.visible = true
    },
    close() {
      this.visible = false
    }
  }
}
</script>

<style scoped>
.preview-thumb {
  object-fit: cover;
  cursor: zoom-in;
  border-radius: 4px;
}

.preview-image-wrapper {
  text-align: center;
}

.preview-image-large {
  max-width: 100%;
  max-height: 70vh;
}
</style>
