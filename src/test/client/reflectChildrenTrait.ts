import { reflectChildrenTrait } from '../../client/reflectChildrenTrait'
import * as assert from '../../util/assert'

assert.deepEqual(
  reflectChildrenTrait(
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    {},
    [
      { width: '100%', height: '100%' },
      { width: '100%', height: '100%' },
    ]
  ),
  [
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    { x: 0, y: 100, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    {},
    [
      { position: 'absolute', width: '100%', height: '100%' },
      { width: '100%', height: '100%' },
    ]
  ),
  [
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    {},
    [
      { width: '100%', height: '100%' },
      { width: '100%', height: '100%' },
      { width: '100%', height: '100%' },
      { width: '100%', height: '100%' },
    ]
  ),
  [
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    { x: 0, y: 100, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    { x: 0, y: 200, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    { x: 0, y: 300, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    { display: 'flex' },
    [
      { width: '100%', height: '100%' },
      { width: '100%', height: '100%' },
    ]
  ),
  [
    { x: 0, y: 0, width: 50, height: 100, fontSize: 10, k: 1, opacity: 1 },
    { x: 50, y: 0, width: 50, height: 100, fontSize: 10, k: 1, opacity: 1 },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    { display: 'flex', flexDirection: 'column' },
    [
      { width: '100%', height: '100%' },
      { width: '100%', height: '100%' },
    ]
  ),
  [
    { x: 0, y: 0, width: 100, height: 50, fontSize: 10, k: 1, opacity: 1 },
    { x: 0, y: 50, width: 100, height: 50, fontSize: 10, k: 1, opacity: 1 },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    { display: 'flex', flexDirection: 'column' },
    [
      { width: '100%', height: '100%' },
      { width: '100%', height: '100%' },
    ]
  ),
  [
    { x: 0, y: 0, width: 100, height: 50, fontSize: 10, k: 1, opacity: 1 },
    { x: 0, y: 50, width: 100, height: 50, fontSize: 10, k: 1, opacity: 1 },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    { display: 'flex', flexDirection: 'row' },
    [
      { width: '100%', height: '100%' },
      { width: '100%', height: '100%' },
      { width: '100%', height: '100%' },
      { width: '100%', height: '100%' },
    ]
  ),
  [
    { x: 0, y: 0, width: 25, height: 100, fontSize: 10, k: 1, opacity: 1 },
    { x: 25, y: 0, width: 25, height: 100, fontSize: 10, k: 1, opacity: 1 },
    { x: 50, y: 0, width: 25, height: 100, fontSize: 10, k: 1, opacity: 1 },
    { x: 75, y: 0, width: 25, height: 100, fontSize: 10, k: 1, opacity: 1 },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    { display: 'flex', flexDirection: 'column' },
    [
      { height: '30px' },
      { height: '30px' },
      { width: '100%', height: '100%' },
      { width: '100%', height: '100%' },
    ]
  ),
  [
    { x: 0, y: 0, width: 100, height: 30, fontSize: 10, k: 1, opacity: 1 },
    { x: 0, y: 30, width: 100, height: 30, fontSize: 10, k: 1, opacity: 1 },
    { x: 0, y: 60, width: 100, height: 20, fontSize: 10, k: 1, opacity: 1 },
    { x: 0, y: 80, width: 100, height: 20, fontSize: 10, k: 1, opacity: 1 },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    { display: 'flex', flexDirection: 'column' },
    [{ height: '30px' }, { height: '30px' }]
  ),
  [
    { x: 0, y: 0, width: 100, height: 30, fontSize: 10, k: 1, opacity: 1 },
    { x: 0, y: 30, width: 100, height: 30, fontSize: 10, k: 1, opacity: 1 },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    { display: 'flex', flexDirection: 'column' },
    [
      { height: '30px' },
      { height: '30px' },
      { height: '30px' },
      { height: '30px' },
    ]
  ),
  [
    { x: 0, y: 0, width: 100, height: 25, fontSize: 10, k: 1, opacity: 1 },
    { x: 0, y: 25, width: 100, height: 25, fontSize: 10, k: 1, opacity: 1 },
    { x: 0, y: 50, width: 100, height: 25, fontSize: 10, k: 1, opacity: 1 },
    { x: 0, y: 75, width: 100, height: 25, fontSize: 10, k: 1, opacity: 1 },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    { display: 'flex', flexDirection: 'row' },
    [
      { width: '30px', height: '100%' },
      { width: '30px', height: '100%' },
      { width: '30px', height: '100%' },
      { width: '30px', height: '100%' },
    ]
  ),
  [
    { x: 0, y: 0, width: 25, height: 100, fontSize: 10, k: 1, opacity: 1 },
    { x: 25, y: 0, width: 25, height: 100, fontSize: 10, k: 1, opacity: 1 },
    { x: 50, y: 0, width: 25, height: 100, fontSize: 10, k: 1, opacity: 1 },
    { x: 75, y: 0, width: 25, height: 100, fontSize: 10, k: 1, opacity: 1 },
  ]
)

assert.deepEqual(
  reflectChildrenTrait(
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    {},
    [{ height: '30px', width: '60px' }]
  ),
  [{ x: 0, y: 0, width: 60, height: 30, fontSize: 10, k: 1, opacity: 1 }]
)

assert.deepEqual(
  reflectChildrenTrait(
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    { display: 'flex', flexDirection: 'column' },
    [{ height: '30px', width: '60px' }]
  ),
  [{ x: 0, y: 0, width: 60, height: 30, fontSize: 10, k: 1, opacity: 1 }]
)
assert.deepEqual(
  reflectChildrenTrait(
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    { display: 'flex', flexDirection: 'row' },
    [{ height: '30px', width: '60px' }]
  ),
  [{ x: 0, y: 0, width: 60, height: 30, fontSize: 10, k: 1, opacity: 1 }]
)

assert.deepEqual(
  reflectChildrenTrait(
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    { display: 'flex', flexDirection: 'row' },
    [{ height: '30.1px', width: '60.1px' }]
  ),
  [{ x: 0, y: 0, width: 60.1, height: 30.1, fontSize: 10, k: 1, opacity: 1 }]
)

assert.deepEqual(
  reflectChildrenTrait(
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    [{ height: '30px', width: '60px' }]
  ),
  [{ x: 20, y: 35, width: 60, height: 30, fontSize: 10, k: 1, opacity: 1 }]
)
assert.deepEqual(
  reflectChildrenTrait(
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    [
      { height: '30px', width: '30px' },
      { height: '30px', width: '30px' },
    ]
  ),
  [
    { x: 20, y: 20, width: 30, height: 30, fontSize: 10, k: 1, opacity: 1 },
    { x: 50, y: 20, width: 30, height: 30, fontSize: 10, k: 1, opacity: 1 },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    [
      { height: '30px', width: '30px' },
      { height: '30px', width: '30px' },
    ]
  ),
  [
    { x: 20, y: 20, width: 30, height: 30, fontSize: 10, k: 1, opacity: 1 },
    { x: 20, y: 50, width: 30, height: 30, fontSize: 10, k: 1, opacity: 1 },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    [
      {
        position: 'relative',
        top: '10px',
        left: '10px',
        height: '30px',
        width: '30px',
      },
      { height: '30px', width: '30px' },
    ]
  ),
  [
    { x: 30, y: 30, width: 30, height: 30, fontSize: 10, k: 1, opacity: 1 },
    { x: 20, y: 50, width: 30, height: 30, fontSize: 10, k: 1, opacity: 1 },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    {},
    [
      {
        position: 'absolute',
        top: '50px',
        left: '50px',
        height: '50px',
        width: '50px',
      },
    ]
  ),
  [{ x: 50, y: 50, width: 50, height: 50, fontSize: 10, k: 1, opacity: 1 }]
)
assert.deepEqual(
  reflectChildrenTrait(
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    {},
    [
      {
        position: 'absolute',
        top: '20px',
        left: '20px',
        height: '20px',
        width: '20px',
      },
      {
        position: 'absolute',
        top: '50px',
        left: '50px',
        height: '50px',
        width: '50px',
      },
    ]
  ),
  [
    { x: 20, y: 20, width: 20, height: 20, fontSize: 10, k: 1, opacity: 1 },
    { x: 50, y: 50, width: 50, height: 50, fontSize: 10, k: 1, opacity: 1 },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    {},
    [
      {
        position: 'absolute',
        top: '20%',
        left: '20%',
        height: '20%',
        width: '20%',
      },
      {
        position: 'absolute',
        top: '50%',
        left: '50%',
        height: '50%',
        width: '50%',
      },
    ]
  ),
  [
    { x: 20, y: 20, width: 20, height: 20, fontSize: 10, k: 1, opacity: 1 },
    { x: 50, y: 50, width: 50, height: 50, fontSize: 10, k: 1, opacity: 1 },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    {},
    [
      {
        position: 'absolute',
        height: '50px',
        width: '50px',
        transform: 'translate(50%, 50%)',
      },
    ]
  ),
  [{ x: 25, y: 25, width: 50, height: 50, fontSize: 10, k: 1, opacity: 1 }]
)
assert.deepEqual(
  reflectChildrenTrait(
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    {},
    [
      {
        position: 'absolute',
        top: '50px',
        left: '50px',
        height: '50px',
        width: '50px',
        transform: 'translate(50px, 50px)',
      },
    ]
  ),
  [{ x: 100, y: 100, width: 50, height: 50, fontSize: 10, k: 1, opacity: 1 }]
)
assert.deepEqual(
  reflectChildrenTrait(
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    [
      {
        position: 'absolute',
        top: '10px',
        left: '10px',
        height: '100%',
        width: '30px',
      },
      { height: '30px', width: '30px' },
    ]
  ),
  [
    { x: 10, y: 10, width: 30, height: 100, fontSize: 10, k: 1, opacity: 1 },
    { x: 35, y: 35, width: 30, height: 30, fontSize: 10, k: 1, opacity: 1 },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    {},
    [
      {
        position: 'absolute',
        top: '0px',
        left: '0px',
        height: '100%',
        width: 'calc(50%-6px)',
      },
    ]
  ),
  [{ x: 0, y: 0, width: 44, height: 100, fontSize: 10, k: 1, opacity: 1 }]
)
assert.deepEqual(
  reflectChildrenTrait(
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    {},
    [
      {
        position: 'absolute',
        top: '0px',
        left: '0px',
        height: '100%',
        width: 'calc(50%-6px)',
      },
      {
        width: '100%',
        height: '100%',
      },
    ]
  ),
  [
    { x: 0, y: 0, width: 44, height: 100, fontSize: 10, k: 1, opacity: 1 },
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    {
      display: 'flex',
      flexWrap: 'wrap',
      alignContent: 'start',
    },
    [
      {
        height: '100%',
        width: '100%',
      },
    ]
  ),
  [{ x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 }]
)

assert.deepEqual(
  reflectChildrenTrait(
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    {
      display: 'flex',
      flexWrap: 'wrap',
      alignContent: 'start',
    },
    [
      {
        height: '40px',
        width: '40px',
      },
      {
        height: '40px',
        width: '40px',
      },
      {
        height: '40px',
        width: '40px',
      },
      {
        height: '40px',
        width: '40px',
      },
    ]
  ),
  [
    { x: 0, y: 0, width: 40, height: 40, fontSize: 10, k: 1, opacity: 1 },
    { x: 40, y: 0, width: 40, height: 40, fontSize: 10, k: 1, opacity: 1 },
    { x: 0, y: 40, width: 40, height: 40, fontSize: 10, k: 1, opacity: 1 },
    { x: 40, y: 40, width: 40, height: 40, fontSize: 10, k: 1, opacity: 1 },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    {
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
      alignContent: 'start',
    },
    [
      {
        height: '40px',
        width: '40px',
      },
      {
        height: '40px',
        width: '40px',
      },
      {
        height: '40px',
        width: '40px',
      },
      {
        height: '40px',
        width: '40px',
      },
    ]
  ),
  [
    { x: 0, y: 0, width: 40, height: 40, fontSize: 10, k: 1, opacity: 1 },
    { x: 0, y: 40, width: 40, height: 40, fontSize: 10, k: 1, opacity: 1 },
    { x: 40, y: 0, width: 40, height: 40, fontSize: 10, k: 1, opacity: 1 },
    { x: 40, y: 40, width: 40, height: 40, fontSize: 10, k: 1, opacity: 1 },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    { x: 0, y: 0, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    {},
    [
      {
        position: 'absolute',
        height: '50px',
        width: '50px',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      },
    ]
  ),
  [{ x: 25, y: 25, width: 50, height: 50, fontSize: 10, k: 1, opacity: 1 }]
)
assert.deepEqual(
  reflectChildrenTrait(
    { x: 25, y: 25, width: 100, height: 100, fontSize: 10, k: 1, opacity: 1 },
    {},
    [
      {
        position: 'absolute',
        height: '50px',
        width: '50px',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      },
    ]
  ),
  [{ x: 50, y: 50, width: 50, height: 50, fontSize: 10, k: 1, opacity: 1 }]
)
