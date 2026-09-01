const recipesData = require('./data/recipes.js')
const recipes = recipesData.recipes

console.log('=== 菜品数据验证报告 ===\n')

// 1. 验证菜品总数
console.log(`1. 菜品总数: ${recipes.length} 道`)
console.log(`   ✓ 目标: 120道，实际: ${recipes.length}道`)
console.log(`   ${recipes.length === 120 ? '✓ 数量正确' : '✗ 数量不正确'}\n`)

// 2. 验证数据完整性
let validCount = 0
let invalidCount = 0
const requiredFields = ['_id', 'name', 'desc', 'color', 'emoji', 'category', 'tags', 'cookTime', 'difficulty', 'ingredients', 'steps']

const invalidRecipes = []

recipes.forEach((recipe, index) => {
  let isValid = true
  const missingFields = []
  
  requiredFields.forEach(field => {
    if (!recipe[field]) {
      isValid = false
      missingFields.push(field)
    }
  })
  
  // 验证ingredients和steps是数组且有内容
  if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
    isValid = false
    missingFields.push('ingredients(empty)')
  }
  
  if (!Array.isArray(recipe.steps) || recipe.steps.length === 0) {
    isValid = false
    missingFields.push('steps(empty)')
  }
  
  if (isValid) {
    validCount++
  } else {
    invalidCount++
    invalidRecipes.push({ index: index + 1, id: recipe._id, name: recipe.name, missing: missingFields })
  }
})

console.log(`2. 数据完整性验证:`)
console.log(`   ✓ 完整菜品: ${validCount} 道`)
console.log(`   ✗ 不完整菜品: ${invalidCount} 道`)
console.log(`   ${invalidCount === 0 ? '✓ 所有菜品数据完整' : '✗ 存在不完整数据'}\n`)

if (invalidRecipes.length > 0) {
  console.log('   不完整菜品详情:')
  invalidRecipes.forEach(r => {
    console.log(`     - 第${r.index}道 [ID:${r.id}] ${r.name}: 缺失 ${r.missing.join(', ')}`)
  })
  console.log('')
}

// 3. 分类分布统计
const categoryCount = {}
recipes.forEach(recipe => {
  const category = recipe.category
  categoryCount[category] = (categoryCount[category] || 0) + 1
})

console.log('3. 分类分布统计:')
Object.entries(categoryCount).forEach(([category, count]) => {
  console.log(`   ${category}: ${count} 道`)
})
console.log('')

// 4. 步骤数量统计
const stepStats = {
  min: Infinity,
  max: 0,
  avg: 0,
  total: 0
}

recipes.forEach(recipe => {
  const stepCount = recipe.steps.length
  stepStats.min = Math.min(stepStats.min, stepCount)
  stepStats.max = Math.max(stepStats.max, stepCount)
  stepStats.total += stepCount
})

stepStats.avg = (stepStats.total / recipes.length).toFixed(1)

console.log('4. 烹饪步骤统计:')
console.log(`   最少步骤: ${stepStats.min} 步`)
console.log(`   最多步骤: ${stepStats.max} 步`)
console.log(`   平均步骤: ${stepStats.avg} 步`)
console.log(`   总步骤数: ${stepStats.total} 步\n`)

// 5. 难度分布统计
const difficultyCount = {}
recipes.forEach(recipe => {
  const difficulty = recipe.difficulty
  difficultyCount[difficulty] = (difficultyCount[difficulty] || 0) + 1
})

console.log('5. 难度分布统计:')
Object.entries(difficultyCount).forEach(([difficulty, count]) => {
  console.log(`   ${difficulty}: ${count} 道`)
})
console.log('')

// 6. 随机抽取验证
console.log('6. 随机菜品验证(前5道):')
recipes.slice(0, 5).forEach((recipe, index) => {
  console.log(`   ${index + 1}. ${recipe.name}`)
  console.log(`      - 分类: ${recipe.category}`)
  console.log(`      - 耗时: ${recipe.cookTime}`)
  console.log(`      - 难度: ${recipe.difficulty}`)
  console.log(`      - 食材: ${recipe.ingredients.length} 种`)
  console.log(`      - 步骤: ${recipe.steps.length} 步`)
})

console.log('\n=== 验证完成 ===')
