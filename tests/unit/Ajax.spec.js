import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { selectWithProps } from '../helpers.js'

import vSelect from '../../src/components/Select.vue'

describe('Asynchronous Loading', () => {
	it('can toggle the loading class', () => {
		const Select = selectWithProps()

		Select.vm.toggleLoading()
		expect(Select.vm.mutableLoading).toEqual(true)

		Select.vm.toggleLoading(true)
		expect(Select.vm.mutableLoading).toEqual(true)
	})

	it('should trigger the search event when the search text changes', async () => {
		const Select = selectWithProps()

		Select.vm.search = 'foo'
		await nextTick()

		const events = Select.emitted('search')

		expect(events).toContainEqual(['foo', Select.vm.toggleLoading])
		expect(events.length).toEqual(1)
	})

	it('should trigger the search event if the search text is empty', async () => {
		const Select = selectWithProps()

		Select.vm.search = 'foo'
		await nextTick()
		Select.vm.search = ''
		await nextTick()

		const events = Select.emitted('search')

		expect(events).toContainEqual(['', Select.vm.toggleLoading])
		expect(events.length).toEqual(2)
	})

	it('can set loading to false from the @search event callback', async () => {
		const Select = shallowMount(vSelect, {
			props: {
				onSearch: (search, loading) => {
					loading(false)
				},
			},
		})

		Select.vm.mutableLoading = true
		Select.vm.search = 'foo'
		await nextTick()

		expect(Select.vm.mutableLoading).toEqual(false)
	})

	it('will sync mutable loading with the loading prop', async () => {
		const Select = selectWithProps({ loading: false })
		Select.setProps({ loading: true })
		await nextTick()

		expect(Select.vm.mutableLoading).toEqual(true)
	})
})
