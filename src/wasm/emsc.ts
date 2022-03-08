//import {testfile} from '../../../public/test.wasm'

import { System } from '../system'

const wasmMemory = new WebAssembly.Memory({ initial: 256, maximum: 256 })

const wasmTable = new WebAssembly.Table({
  initial: 1,
  maximum: 1,
  element: 'anyfunc',
})

const asmLibraryArg = {
  __handle_stack_overflow: () => {},
  emscripten_resize_heap: () => {},
  __lock: () => {},
  __unlock: () => {},
  memory: wasmMemory,
  table: wasmTable,
}

const info = {
  env: asmLibraryArg,
  wasi_snapshot_preview1: asmLibraryArg,
}

export async function loadWasm(system: System, fileName: string): Promise<any> {
  //console.log('got here')
  if (system.cache.wasm[fileName]) {
    return system.cache.wasm[fileName].instance.exports
  } else {
    const response = await fetch(fileName)
    const bytes = await response.arrayBuffer()
    const wasmObj = await WebAssembly.instantiate(bytes, info)
    const wasmExports = wasmObj.instance.exports
    system.cache.wasm[fileName] = wasmObj
    return wasmExports
  }
}

//loadWasm();
//export {wasmExports};
