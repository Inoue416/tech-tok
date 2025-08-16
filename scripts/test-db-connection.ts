/**
 * Database Connection Test Script
 * このスクリプトはPostgreSQLデータベースとPrismaクライアントの疎通確認を行います
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testDatabaseConnection() {
  console.log('🔍 データベース疎通テストを開始します...\n')

  try {
    // 1. 基本接続テスト
    console.log('1️⃣ 基本接続テスト')
    await prisma.$connect()
    console.log('✅ データベース接続成功\n')

    // 2. Userテーブル基本CRUD操作
    console.log('2️⃣ User テーブル CRUD操作テスト')
    
    // Create
    const testUser = await prisma.user.create({
      data: {
        username: 'testuser001',
        displayName: 'Test User',
        email: 'test@example.com',
        bio: 'テスト用ユーザーです'
      }
    })
    console.log('✅ ユーザー作成成功:', testUser.id)

    // Read
    const fetchedUser = await prisma.user.findUnique({
      where: { id: testUser.id }
    })
    console.log('✅ ユーザー取得成功:', fetchedUser?.username)

    // Update
    const updatedUser = await prisma.user.update({
      where: { id: testUser.id },
      data: { bio: '更新されたテストユーザーです' }
    })
    console.log('✅ ユーザー更新成功:', updatedUser.bio)

    // 3. Technologyテーブルとリレーションテスト
    console.log('\n3️⃣ Technology テーブルとリレーション作成テスト')
    
    const techReact = await prisma.technology.create({
      data: {
        name: 'React',
        category: 'Frontend',
        color: '#61DAFB'
      }
    })
    console.log('✅ Technology作成成功:', techReact.name)

    const userTech = await prisma.userTechnology.create({
      data: {
        userId: testUser.id,
        technologyId: techReact.id
      }
    })
    console.log('✅ UserTechnology関連付け成功:', userTech.id)

    // 4. RSS Source & Entry テスト
    console.log('\n4️⃣ RSS Source & Entry テスト')
    
    const rssSource = await prisma.rssSource.create({
      data: {
        feedUrl: 'https://example.com/rss.xml',
        title: 'Test Blog',
        description: 'テスト用RSSフィード',
        category: 'Tech'
      }
    })
    console.log('✅ RSS Source作成成功:', rssSource.title)

    const rssEntry = await prisma.rssEntry.create({
      data: {
        sourceId: rssSource.id,
        guid: 'test-guid-001',
        title: 'Test Article',
        description: 'テスト記事です',
        publishedAt: new Date(),
        contentHash: 'hash123'
      }
    })
    console.log('✅ RSS Entry作成成功:', rssEntry.title)

    // 5. 複合ユニーク制約テスト
    console.log('\n5️⃣ 複合ユニーク制約テスト')
    
    try {
      // 同じuser_id + technology_idでUserTechnologyを作成（失敗するはず）
      await prisma.userTechnology.create({
        data: {
          userId: testUser.id,
          technologyId: techReact.id
        }
      })
      console.log('❌ 複合ユニーク制約テスト失敗（重複が作成されてしまった）')
    } catch (error: any) {
      if (error.code === 'P2002') {
        console.log('✅ 複合ユニーク制約テスト成功（期待されるエラー）')
      } else {
        console.log('❌ 予期しないエラー:', error.message)
      }
    }

    // 6. リレーション取得テスト
    console.log('\n6️⃣ リレーション取得テスト')
    
    const userWithTechnologies = await prisma.user.findUnique({
      where: { id: testUser.id },
      include: {
        userTechnologies: {
          include: {
            technology: true
          }
        }
      }
    })
    console.log('✅ ユーザー + 技術取得成功:', 
      userWithTechnologies?.userTechnologies[0]?.technology.name)

    // 7. FeedItem作成テスト
    console.log('\n7️⃣ FeedItem作成テスト')
    
    const feedItem = await prisma.feedItem.create({
      data: {
        type: 'RSS_ENTRY',
        rssEntryId: rssEntry.id,
        publishedAt: new Date(),
        rankScore: 0.8
      }
    })
    console.log('✅ FeedItem作成成功:', feedItem.id)

    // 8. クリーンアップ
    console.log('\n8️⃣ テストデータクリーンアップ')
    
    await prisma.feedItem.deleteMany()
    await prisma.rssEntry.deleteMany()
    await prisma.rssSource.deleteMany()
    await prisma.userTechnology.deleteMany()
    await prisma.technology.deleteMany()
    await prisma.user.deleteMany()
    
    console.log('✅ テストデータクリーンアップ完了\n')

    console.log('🎉 全ての疎通テストが成功しました！')

  } catch (error) {
    console.error('❌ エラーが発生しました:', error)
  } finally {
    await prisma.$disconnect()
    console.log('📤 データベース接続を終了しました')
  }
}

// スクリプト実行
testDatabaseConnection().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})