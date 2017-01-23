<template>
	<div class="sk-wave">
		<div class="sk-rect sk-rect1" :style="style"></div>
		<div class="sk-rect sk-rect2" :style="style"></div>
		<div class="sk-rect sk-rect3" :style="style"></div>
		<div class="sk-rect sk-rect4" :style="style"></div>
		<div class="sk-rect sk-rect5" :style="style"></div>
	</div>
</template>

<style rel="stylesheet/scss" lang="sass">
	.sk-wave
	{
		margin: 0 auto;
	}
</style>

<script>
    export default {
		props: {
			color: {
				type: String,
				default: "#ff9900"
			}
		},
		computed: {
			style()
			{
				return `background-color: ${ this.color }`
			}
		}
	}
</script>
