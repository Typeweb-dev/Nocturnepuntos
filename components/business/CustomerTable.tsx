'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { Customer } from '@/lib/mock-data'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { getMembershipColor, formatDate } from '@/lib/utils-nocturne'
import { Search, ChevronRight } from 'lucide-react'

interface CustomerTableProps {
  customers: Customer[]
  onSelectCustomer?: (customer: Customer) => void
}

export function CustomerTable({ customers, onSelectCustomer }: CustomerTableProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [customers, search, statusFilter])

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-nocturne-light" />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-nocturne-light/20 bg-nocturne-darker py-2 pl-10 pr-4 text-white placeholder-nocturne-light transition-smooth hover:border-nocturne-light/40 focus:border-nocturne-accent/50 focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-nocturne-light/20 bg-nocturne-darker px-4 py-2 text-white transition-smooth hover:border-nocturne-light/40 focus:border-nocturne-accent/50 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-nocturne-light/20 bg-nocturne-darker">
        <table className="w-full text-sm">
          <thead className="border-b border-nocturne-light/20 bg-nocturne-dark">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-white">Name</th>
              <th className="px-6 py-4 text-left font-semibold text-white">Email</th>
              <th className="px-6 py-4 text-left font-semibold text-white">Level</th>
              <th className="px-6 py-4 text-right font-semibold text-white">Points</th>
              <th className="px-6 py-4 text-left font-semibold text-white">Status</th>
              <th className="px-6 py-4 text-left font-semibold text-white">Joined</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-nocturne-light/10">
            {filteredCustomers.map((customer) => (
              <tr
                key={customer.id}
                className="transition-smooth hover:bg-nocturne-light/5"
                onClick={() => onSelectCustomer?.(customer)}
              >
                <td className="px-6 py-4 font-medium text-white">{customer.name}</td>
                <td className="px-6 py-4 text-nocturne-light">{customer.email}</td>
                <td className={`px-6 py-4 font-medium ${getMembershipColor(customer.membershipLevel)}`}>
                  {customer.membershipLevel.charAt(0).toUpperCase() + customer.membershipLevel.slice(1)}
                </td>
                <td className="px-6 py-4 text-right text-white font-semibold">{customer.totalPoints}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={customer.status} />
                </td>
                <td className="px-6 py-4 text-nocturne-light text-xs">
                  {formatDate(customer.joinedDate)}
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/clientes/${customer.id}`}
                    className="text-nocturne-accent transition-smooth hover:text-nocturne-accent-light"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredCustomers.length === 0 && (
        <div className="rounded-lg border border-nocturne-light/20 bg-nocturne-darker py-12 text-center">
          <p className="text-nocturne-light">No customers found</p>
        </div>
      )}

      <div className="text-xs text-nocturne-light">
        Showing {filteredCustomers.length} of {customers.length} customers
      </div>
    </div>
  )
}
