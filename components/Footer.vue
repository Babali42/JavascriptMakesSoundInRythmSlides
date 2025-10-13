<template>
  <div class="absolute bottom-2 right-4 text-gray-400 text-sm select-none">
    <div class="flex items-center justify-between">
      <div>
        {{ $slidev.nav.currentPage }} / {{ $slidev.nav.total }}
      </div>
      <div class="left-8">
        <img
            src="../snowcamp-logo.svg"
            alt="Logo"
            class="h-[4vh] object-contain"
        />
      </div>
    </div>
  </div>
</template>