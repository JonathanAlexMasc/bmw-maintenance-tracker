'use client';

import {
    Activity,
    AlertTriangle,
    CalendarClock,
    Car,
    CheckCircle2,
    Gauge,
    Plus,
    Wrench,
} from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';

type Priority = 'overdue' | 'due-soon' | 'scheduled' | 'complete';

type MaintenanceItem = {
    id: number;
    title: string;
    category: string;
    dueMileage: number;
    intervalMiles: number;
    lastDoneMileage: number;
    lastDoneDate: string;
    estimatedCost: number;
    notes: string;
};

const currentMileage = 68420;

const initialItems: MaintenanceItem[] = [
    {
        id: 1,
        title: 'Engine oil and filter',
        category: 'Drivetrain',
        dueMileage: 69500,
        intervalMiles: 7500,
        lastDoneMileage: 62000,
        lastDoneDate: '2025-11-12',
        estimatedCost: 145,
        notes: 'Use BMW LL-01 5W-30 and inspect for leaks.',
    },
    {
        id: 2,
        title: 'Brake fluid flush',
        category: 'Brakes',
        dueMileage: 68200,
        intervalMiles: 24000,
        lastDoneMileage: 44200,
        lastDoneDate: '2024-04-20',
        estimatedCost: 185,
        notes: 'Two-year service item. Check pedal feel after bleed.',
    },
    {
        id: 3,
        title: 'Cabin microfilter',
        category: 'Comfort',
        dueMileage: 71000,
        intervalMiles: 15000,
        lastDoneMileage: 56000,
        lastDoneDate: '2025-06-04',
        estimatedCost: 75,
        notes: 'Charcoal filter preferred before summer.',
    },
    {
        id: 4,
        title: 'Spark plugs',
        category: 'Ignition',
        dueMileage: 80000,
        intervalMiles: 60000,
        lastDoneMileage: 20000,
        lastDoneDate: '2022-08-16',
        estimatedCost: 320,
        notes: 'Replace coils only if misfires are present.',
    },
    {
        id: 5,
        title: 'Tire rotation and balance',
        category: 'Chassis',
        dueMileage: 69000,
        intervalMiles: 6000,
        lastDoneMileage: 63000,
        lastDoneDate: '2026-01-09',
        estimatedCost: 95,
        notes: 'Measure tread depth and note any inner-edge wear.',
    },
];

const storageKey = 'bmw-maintenance-items-v1';

function getPriority(item: MaintenanceItem): Priority {
    const remaining = item.dueMileage - currentMileage;

    if (remaining < 0) {
        return 'overdue';
    }

    if (remaining <= 1500) {
        return 'due-soon';
    }

    return 'scheduled';
}

function priorityLabel(priority: Priority) {
    const labels: Record<Priority, string> = {
        overdue: 'Overdue',
        'due-soon': 'Due soon',
        scheduled: 'Scheduled',
        complete: 'Complete',
    };

    return labels[priority];
}

function formatMileage(value: number) {
    return new Intl.NumberFormat('en-US').format(value);
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(value);
}

export default function Home() {
    const [items, setItems] = useState<MaintenanceItem[]>(initialItems);
    const [title, setTitle] = useState('');
    const [dueMileage, setDueMileage] = useState('');
    const [estimatedCost, setEstimatedCost] = useState('');
    const [filter, setFilter] = useState<'all' | Priority>('all');

    useEffect(() => {
        const savedItems = window.localStorage.getItem(storageKey);

        if (savedItems) {
            setItems(JSON.parse(savedItems) as MaintenanceItem[]);
        }
    }, []);

    useEffect(() => {
        window.localStorage.setItem(storageKey, JSON.stringify(items));
    }, [items]);

    const filteredItems = useMemo(() => {
        return items
            .filter((item) => filter === 'all' || getPriority(item) === filter)
            .sort((a, b) => a.dueMileage - b.dueMileage);
    }, [filter, items]);

    const overdueCount = items.filter((item) => getPriority(item) === 'overdue').length;
    const dueSoonCount = items.filter((item) => getPriority(item) === 'due-soon').length;
    const nextItem = [...items].sort((a, b) => a.dueMileage - b.dueMileage)[0];
    const forecastCost = items
        .filter((item) => item.dueMileage - currentMileage <= 5000)
        .reduce((total, item) => total + item.estimatedCost, 0);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const parsedMileage = Number(dueMileage);
        const parsedCost = Number(estimatedCost || 0);

        if (!title.trim() || !Number.isFinite(parsedMileage)) {
            return;
        }

        setItems((existingItems) => [
            ...existingItems,
            {
                id: Date.now(),
                title: title.trim(),
                category: 'Custom',
                dueMileage: parsedMileage,
                intervalMiles: 0,
                lastDoneMileage: currentMileage,
                lastDoneDate: new Date().toISOString().slice(0, 10),
                estimatedCost: Number.isFinite(parsedCost) ? parsedCost : 0,
                notes: 'Added from quick entry.',
            },
        ]);
        setTitle('');
        setDueMileage('');
        setEstimatedCost('');
    }

    function markDone(item: MaintenanceItem) {
        setItems((existingItems) =>
            existingItems.map((existingItem) =>
                existingItem.id === item.id
                    ? {
                          ...existingItem,
                          lastDoneMileage: currentMileage,
                          lastDoneDate: new Date().toISOString().slice(0, 10),
                          dueMileage:
                              currentMileage +
                              (existingItem.intervalMiles > 0 ? existingItem.intervalMiles : 7500),
                      }
                    : existingItem,
            ),
        );
    }

    return (
        <main className="app-shell">
            <section className="hero">
                <div className="hero-copy">
                    <div className="eyebrow">
                        <Car size={18} />
                        BMW garage
                    </div>
                    <h1>Maintenance cockpit for your BMW</h1>
                    <p>
                        Track what is due, what was done, and what your next service visit is likely
                        to cost.
                    </p>
                </div>
                <div className="vehicle-card" aria-label="Vehicle summary">
                    <div>
                        <span>2018 BMW 340i xDrive</span>
                        <strong>{formatMileage(currentMileage)} mi</strong>
                    </div>
                    <div className="vehicle-visual">
                        <div className="car-roof" />
                        <div className="car-body" />
                        <div className="wheel left" />
                        <div className="wheel right" />
                    </div>
                </div>
            </section>

            <section className="stats-grid" aria-label="Maintenance overview">
                <article className="metric">
                    <AlertTriangle size={22} />
                    <span>Overdue</span>
                    <strong>{overdueCount}</strong>
                </article>
                <article className="metric">
                    <CalendarClock size={22} />
                    <span>Due soon</span>
                    <strong>{dueSoonCount}</strong>
                </article>
                <article className="metric">
                    <Gauge size={22} />
                    <span>Next service</span>
                    <strong>{formatMileage(nextItem.dueMileage)} mi</strong>
                </article>
                <article className="metric">
                    <Activity size={22} />
                    <span>5k mi forecast</span>
                    <strong>{formatCurrency(forecastCost)}</strong>
                </article>
            </section>

            <section className="workspace">
                <aside className="panel">
                    <div className="panel-heading">
                        <h2>Quick add</h2>
                        <Plus size={20} />
                    </div>
                    <form className="quick-form" onSubmit={handleSubmit}>
                        <label>
                            Item
                            <input
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                placeholder="Alignment check"
                            />
                        </label>
                        <label>
                            Due mileage
                            <input
                                inputMode="numeric"
                                value={dueMileage}
                                onChange={(event) => setDueMileage(event.target.value)}
                                placeholder="72500"
                            />
                        </label>
                        <label>
                            Estimated cost
                            <input
                                inputMode="numeric"
                                value={estimatedCost}
                                onChange={(event) => setEstimatedCost(event.target.value)}
                                placeholder="160"
                            />
                        </label>
                        <button type="submit">
                            <Plus size={18} />
                            Add item
                        </button>
                    </form>

                    <div className="service-note">
                        <Wrench size={20} />
                        <p>
                            BMW CBS reminders are useful, but this tracker keeps wear items,
                            owner-preferred intervals, and receipts in one place.
                        </p>
                    </div>
                </aside>

                <section className="maintenance-list" aria-label="Maintenance items">
                    <div className="list-toolbar">
                        <h2>Maintenance plan</h2>
                        <div className="filters" aria-label="Filter maintenance items">
                            {(['all', 'overdue', 'due-soon', 'scheduled'] as const).map((value) => (
                                <button
                                    className={filter === value ? 'active' : ''}
                                    key={value}
                                    onClick={() => setFilter(value)}
                                    type="button"
                                >
                                    {value === 'all' ? 'All' : priorityLabel(value)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="items">
                        {filteredItems.map((item) => {
                            const priority = getPriority(item);
                            const milesRemaining = item.dueMileage - currentMileage;

                            return (
                                <article className="item-card" key={item.id}>
                                    <div className="item-main">
                                        <div className={`status-dot ${priority}`} />
                                        <div>
                                            <div className="item-title-row">
                                                <h3>{item.title}</h3>
                                                <span className={`status-pill ${priority}`}>
                                                    {priorityLabel(priority)}
                                                </span>
                                            </div>
                                            <p>{item.notes}</p>
                                        </div>
                                    </div>
                                    <div className="item-meta">
                                        <span>{item.category}</span>
                                        <span>Due {formatMileage(item.dueMileage)} mi</span>
                                        <span>
                                            {milesRemaining < 0
                                                ? `${formatMileage(Math.abs(milesRemaining))} mi late`
                                                : `${formatMileage(milesRemaining)} mi left`}
                                        </span>
                                        <span>{formatCurrency(item.estimatedCost)}</span>
                                    </div>
                                    <div className="item-footer">
                                        <span>
                                            Last done {item.lastDoneDate} at{' '}
                                            {formatMileage(item.lastDoneMileage)} mi
                                        </span>
                                        <button type="button" onClick={() => markDone(item)}>
                                            <CheckCircle2 size={18} />
                                            Mark done
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>
            </section>
        </main>
    );
}
