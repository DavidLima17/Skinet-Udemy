using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.specifications;
using Microsoft.EntityFrameworkCore;

namespace Infastructure.Data
{
    public class SpecificationEvaluator<T> where T : BaseEntity
    {
        public static IQueryable<T> GetQuery(IQueryable<T> inputQuery, ISpecifications<T> spec){
            var query = inputQuery;

            if (spec.Criteria != null){
                query = query.Where(spec.Criteria);
            }

            if (spec.OrderBy != null){
                query = query.OrderBy(spec.OrderBy);
            }

            if (spec.OrderByDesc != null){
                query = query.OrderByDescending(spec.OrderByDesc);
            }

            if (spec.IsPagingEnabled){
                query = query.Skip(spec.Skip).Take(spec.Take);
            }

            query = spec.Includes.Aggregate(query, (current, include) => current.Include(include));
            return query;
        }
    }
}