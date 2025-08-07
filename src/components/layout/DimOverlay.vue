<template>
  <div class="fixed inset-0 bg-black/50 z-10" @click.self="$emit('close')">
    <slot></slot>
  </div>
</template>
