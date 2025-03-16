import { MeiliSearch } from 'meilisearch'

import { getEnv } from '@evershop/evershop/src/lib/util/getEnv'
import { getConfig } from '@evershop/evershop/src/lib/util/getConfig';
import { ENV_EVERSHOP_MEILISEARCH, CONFIG_EVERSHOP_MEILISEARCH } from '../utils/constants';
const apiKey = getConfig(CONFIG_EVERSHOP_MEILISEARCH.API_KEY) || getEnv(ENV_EVERSHOP_MEILISEARCH.API_KEY);
const host = getConfig(CONFIG_EVERSHOP_MEILISEARCH.HOST) || getEnv(ENV_EVERSHOP_MEILISEARCH.HOST);

if (!apiKey) {
  throw new Error(`Meilisearch Api key is missing. Please add to env with key name: ${ENV_EVERSHOP_MEILISEARCH.API_KEY}`);
}

if (!host) {
  throw new Error(`Meilisearch Host is missing. Please add to env with key name: ${ENV_EVERSHOP_MEILISEARCH.HOST}`);
}

export class MeiliSearchService {
  private client: MeiliSearch;
  constructor(apiKey: string, host: string) {
    this.client = new MeiliSearch({
      host,
      apiKey
    })
  }
  getClient(): MeiliSearch {
    return this.client
  };

  async getIndex({
    name
  }: {
    name: string
  }): Promise<unknown> {
    const client = this.getClient();
    const index = await client.getIndex(name);
    return index;
  }

  async getIndexs(pagination?: {
    offset?: number
    limit?: number
  }): Promise<unknown> {
    const client = this.getClient();
    const indexes = client.getIndexes(pagination);
    return indexes;
  }

  async createIndex({
    name,
    options
  }: {
    name: string
    options: Record<string, unknown>
  }): Promise<unknown> {
    const client = this.getClient();
    const index = await client.createIndex(name, options)
    return index
  }

  async updateIndex({
    name,
    options
  }: {
    name: string
    options: Record<string, unknown>
  }): Promise<unknown> {
    const client = this.getClient();
    const index = await client.updateIndex(name, options)
    return index
  }

  async updateSettingsOfIndex(
    {
      name,
      settings
    }: {
      name: string
      settings: Record<string, any>
    }): Promise<void> {
    const client = this.getClient();
    await client.index(name).updateSettings(settings)
  }

  async deleteIndex(name: string): Promise<void> {
    const client = this.getClient();
    await client.deleteIndex(name)
  }

  async deleteIndexIfExists(name: string): Promise<void> {
    const client = this.getClient();
    await client.deleteIndexIfExists(name)
  }

  async searchDocuments({
    indexName,
    query,
    options = {}
  }: {
    indexName: string
    query: string
    options?: Record<string, any>
  }): Promise<unknown> {
    const client = this.getClient();
    const result = await client
      .index(indexName)
      .search(query, options)
    return result
  }

  async createDocuments({
    indexName,
    payload,
  }: {
    indexName: string
    payload: Record<string, unknown>[]
  }): Promise<unknown> {
    const client = this.getClient();

    const documents = await client
      .index(indexName)
      .addDocuments(payload)
    return documents
  }

  async updateDocuments({
    indexName,
    payload,
  }: {
    indexName: string
    payload: Record<string, unknown>[]
  }): Promise<unknown> {
    return this.createDocuments({
      indexName,
      payload,
    })
  }

  async deleteDocumentById({
    indexName,
    id
  }: {
    indexName: string
    id: string
  }): Promise<void> {
    const client = this.getClient();
    await client.index(indexName).deleteDocument(id)
  }

  async deleteDocumentsByIndexName({
    name
  }: {
    name: string
  }): Promise<void> {
    const client = this.getClient();
    await client.index(name).deleteAllDocuments()
  }
}

export const meiliSearchService: MeiliSearchService = new MeiliSearchService(apiKey, host)
