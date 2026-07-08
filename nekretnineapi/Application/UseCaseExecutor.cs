using FluentValidation;

namespace Application
{
    public class UseCaseExecutor
    {
        private readonly IServiceProvider _provider;

        public UseCaseExecutor(IServiceProvider provider)
        {
            _provider = provider;
        }

        public TResult ExecuteQuery<TSearch, TResult>(IQuery<TSearch, TResult> query, TSearch search)
        {
            return query.Execute(search);
        }

        public void ExecuteCommand<TRequest>(ICommand<TRequest> command, TRequest request)
        {
            var validator = _provider.GetService(typeof(IValidator<TRequest>)) as IValidator<TRequest>;

            if (validator != null)
            {
                var result = validator.Validate(request);
                if (!result.IsValid)
                    throw new ValidationException(result.Errors);
            }

            command.Execute(request);
        }
    }
}
